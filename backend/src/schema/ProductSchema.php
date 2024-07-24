<?php
namespace App\Schema;

require_once __DIR__ . '/../../vendor/autoload.php';

use App\Config\DB;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use GraphQL\Type\Schema;
use App\Types\ProductType;

class ProductSchema extends AbstractSchema {
    protected $queryType;
    protected $mutationType;

    public function __construct() {
        $this->queryType = new ObjectType([
            'name' => 'Query',
            'fields' => [
                'products' => [
                    'type' => Type::listOf(new ProductType()),
                    'args' => [
                        'category' => Type::string(),
                    ],
                    'resolve' => function($root, $args) {
                        try {
                            $mysqli = DB::getConnection();
                            if (!$mysqli) {
                                throw new \Exception('Failed to connect to the database');
                            }

                            $category = $args['category'] ?? 'All';
                            error_log('Category argument: ' . $category);

                            if ($category === 'All') {
                                $query = 'SELECT p.*, g.image_url, a.name AS attribute_name, a.type AS attribute_type, asi.displayValue, asi.value, pr.amount, pr.currency_label
                                        FROM products p
                                        LEFT JOIN galleries g ON p.id = g.product_id
                                        LEFT JOIN attributes_set a ON p.id = a.product_id
                                        LEFT JOIN attribute_set_items asi ON a.id = asi.attribute_id
                                        LEFT JOIN prices pr ON p.id = pr.product_id';
                                error_log('Executing query for all products: ' . $query);
                                $stmt = $mysqli->prepare($query);
                            } else {
                                $query = 'SELECT p.*, g.image_url, a.name AS attribute_name, a.type AS attribute_type, asi.displayValue, asi.value, pr.amount, pr.currency_label
                                        FROM products p
                                        LEFT JOIN galleries g ON p.id = g.product_id
                                        LEFT JOIN attributes_set a ON p.id = a.product_id
                                        LEFT JOIN attribute_set_items asi ON a.id = asi.attribute_id
                                        LEFT JOIN prices pr ON p.id = pr.product_id
                                        WHERE p.category_id = (SELECT id FROM categories WHERE name = ?)';
                                error_log('Executing query for category: ' . $query);
                                $stmt = $mysqli->prepare($query);
                                $stmt->bind_param('s', $category);
                            }

                            $stmt->execute();
                            $result = $stmt->get_result();

                            $products = [];
                            while ($row = $result->fetch_assoc()) {
                                $productId = $row['id'];
                                if (!isset($products[$productId])) {
                                    $products[$productId] = [
                                        'id' => $row['id'],
                                        'name' => $row['name'],
                                        'inStock' => $row['inStock'],
                                        'description' => $row['description'],
                                        'category_id' => $row['category_id'],
                                        'brand' => $row['brand'],
                                        'images' => [],
                                        'attributes' => [],
                                        'price' => null // Initialize price as null
                                    ];
                                }

                                if ($row['image_url']) {
                                    $products[$productId]['images'][] = $row['image_url'];
                                }

                                if ($row['attribute_name']) {
                                    $products[$productId]['attributes'][] = [
                                        'name' => $row['attribute_name'],
                                        'type' => $row['attribute_type'],
                                        'displayValue' => $row['displayValue'],
                                        'value' => $row['value']
                                    ];
                                }

                                if ($row['amount']) {
                                    $products[$productId]['price'] = [
                                        'amount' => $row['amount'],
                                        'currency_label' => $row['currency_label']
                                    ];
                                }
                            }

                            $stmt->close();
                            return array_values($products);

                        } catch (\Exception $e) {
                            error_log('Error: ' . $e->getMessage());
                            return null;
                        }
                    }
                ]
            ]
        ]);

        $this->mutationType = null;
    }

    public function getQueryType(): ObjectType {
        return $this->queryType;
    }

    public function getMutationType(): ObjectType {
        return $this->mutationType;
    }
}
?>