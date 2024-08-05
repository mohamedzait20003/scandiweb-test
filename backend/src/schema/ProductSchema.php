<?php
namespace App\Schema;

require_once __DIR__ . '/../../vendor/autoload.php';

use App\Config\DB;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\InputObjectType;
use GraphQL\Type\Definition\Type;
use GraphQL\Error\UserError;

use App\Types\ProductType;
use App\Types\OrderType;

class ProductSchema extends AbstractSchema {
    protected $queryType;
    protected $mutationType;

    public function __construct() {
        $this->queryType = new ObjectType([
            'name' => 'Query',
            'fields' => [
                'Products' => [
                    'type' => Type::listOf(new ProductType()),
                    'args' => [
                        'category_id' => Type::int()
                    ],
                    'resolve' => function($root, $args, $context) {
                        return $this->fetchProducts($args['category_id'] ?? null);
                    }
                ]
            ]
        ]);

        $this->mutationType = new ObjectType([
            'name' => 'Mutation',
            'fields' => [
                'createProduct' => [
                    'type' => new ObjectType([
                        'name' => 'OrderResponse',
                        'fields' => [
                            'status' => Type::string(),
                            'message' => Type::string(),
                        ]
                    ]),
                    'args' => [
                        'order' => [
                            'type' => new InputObjectType([
                                'name' => 'OrderInput',
                                'fields' => [
                                    'total_quantity' => Type::nonNull(Type::int()),
                                    'date' => Type::nonNull(Type::string()),
                                    'items' => Type::listOf(new InputObjectType([
                                        'name' => 'OrderItemInput',
                                        'fields' => [
                                            'product_id' => Type::nonNull(Type::int()),
                                            'quantity' => Type::nonNull(Type::int()),
                                            'price' => Type::nonNull(Type::float()),
                                            'attributes' => Type::listOf(new InputObjectType([
                                                'name' => 'AttributeInput',
                                                'fields' => [
                                                    'set_id' => Type::nonNull(Type::int()),
                                                    'choice_id' => Type::nonNull(Type::int()),
                                                ]
                                            ]))
                                        ]
                                    ]))
                                ]
                            ])
                        ]
                    ],
                    'resolve' => function($root, $args, $context, ResolveInfo $info) {
                        return $this->PutOrder($args['order']);
                    }
                ]
            ]
        ]);
    }

    private function fetchProducts($category_id = null) {
        $mysqli = null;
        try {
            $mysqli = DB::getConnection();
            if (!$mysqli) {
                throw new \Exception('Failed to connect to the database');
            }

            $query = 'SELECT Id, name, inStock, description, brand FROM product';
            if ($category_id !== null) {
                $query .= ' WHERE category_id = ?';
            }

            $stmt = $mysqli->prepare($query);
            if ($category_id !== null) {
                $stmt->bind_param('i', $category_id);
            }
            $stmt->execute();
            $result = $stmt->get_result();
            return $result->fetch_all(MYSQLI_ASSOC);
        } catch (\Exception $e) {
            error_log('Error: ' . $e->getMessage());
            throw new \Exception('Internal server error: ' . $e->getMessage());
        } finally {
            if ($mysqli && $mysqli->ping()) {
                DB::closeConnection();
            }
        }
    }

    private function PutOrder($order){
        $mysqli = null;
        try {
            $mysqli = DB::getConnection();
            if (!$mysqli) {
                throw new \Exception('Failed to connect to the database');
            }

            $stmt = $mysqli->prepare('INSERT INTO `order` (total_quantity, date) VALUES (?, ?)');
            if (!$stmt) {
                throw new \Exception('Failed to prepare statement for order');
            }

            $stmt->bind_param("is", $order['total_quantity'], $order['date']);
            if (!$stmt->execute()) {
                throw new \Exception('Failed to execute statement for order');
            }
            $orderId = $stmt->insert_id;
            $stmt->close();

            $stmt = $mysqli->prepare("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)");
            if (!$stmt) {
                throw new \Exception('Failed to prepare statement for order items');
            }

            foreach ($order['items'] as $item){
                $stmt->bind_param("iiid", $orderId, $item['product_id'], $item['quantity'], $item['price']);
                if (!$stmt->execute()) {
                    throw new \Exception('Failed to execute statement for order items');
                }
                $itemId = $stmt->insert_id;

                $attrStmt = $mysqli->prepare("INSERT INTO item_attributes (item_id, set_id, choice_id) VALUES (?, ?, ?)");
                if (!$attrStmt) {
                    throw new \Exception('Failed to prepare statement for item attributes');
                }
                foreach ($item['attributes'] as $attribute) {
                    $attrStmt->bind_param("iii", $itemId, $attribute['set_id'], $attribute['choice_id']);
                    if (!$attrStmt->execute()) {
                        throw new \Exception('Failed to execute statement for item attributes');
                    }
                }
                $attrStmt->close();
            }
            $stmt->close();

            return [
                'status' => 'success',
                'message' => 'Order and items created successfully'
            ];
        } catch (\Exception $e) {
            if ($mysqli) {
                $mysqli->close();
            }
            return [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        } finally {
            if ($mysqli && $mysqli->ping()) {
                DB::closeConnection();
            }
        }
    }

    public function getQueryType(): ObjectType {
        return $this->queryType;
    }

    public function getMutationType(): ObjectType {
        return $this->mutationType;
    }
}
?>