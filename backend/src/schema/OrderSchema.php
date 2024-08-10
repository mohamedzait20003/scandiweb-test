<?php
namespace App\Schema;

require_once __DIR__ . '/../../vendor/autoload.php';

use App\Config\DB;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\InputObjectType;

class OrderSchema extends AbstractSchema {
    public function __construct() {
        $this->mutationType = new ObjectType([
            'name' => 'Mutation',
            'fields' => [
                'createOrder' => [
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
                                    'total_price' => Type::nonNull(Type::float()),
                                    'date' => Type::nonNull(Type::string()),
                                    'items' => Type::listOf(new InputObjectType([
                                        'name' => 'OrderItemInput',
                                        'fields' => [
                                            'product_id' => Type::nonNull(Type::string()),
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
    
    private function PutOrder($order){
        $mysqli = null;
        try {
            $mysqli = DB::getConnection();
            if (!$mysqli) {
                throw new \Exception('Failed to connect to the database');
            }
    
            $stmt = $mysqli->prepare('INSERT INTO `orders` (total_quantity, total_price, date) VALUES (?, ?, ?)');
            if (!$stmt) {
                throw new \Exception('Failed to prepare statement for order');
            }
    
            $stmt->bind_param("ids", $order['total_quantity'], $order['total_price'], $order['date']);
            if (!$stmt->execute()) {
                throw new \Exception('Failed to execute statement for order');
            }
            $orderId = $stmt->insert_id;
            $stmt->close();
    
            $stmt = $mysqli->prepare("INSERT INTO order_item (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)");
            if (!$stmt) {
                throw new \Exception('Failed to prepare statement for order items');
            }
    
            foreach ($order['items'] as $item){
                $stmt->bind_param("isid", $orderId, $item['product_id'], $item['quantity'], $item['price']);
                if (!$stmt->execute()) {
                    throw new \Exception('Failed to execute statement for order items');
                }
                $itemId = $stmt->insert_id;
    
                if (!empty($item['attributes'])) {
                    $attrStmt = $mysqli->prepare("INSERT INTO order_item_attributes (item_id, set_id, choice_id) VALUES (?, ?, ?)");
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