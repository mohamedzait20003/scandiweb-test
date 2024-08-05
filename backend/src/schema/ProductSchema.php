<?php
namespace App\Schema;

require_once __DIR__ . '/../../vendor/autoload.php';

use App\Config\DB;
use GraphQL\Type\Definition\ObjectType;
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
                    'args' => new OrderType(),
                    'resolve' => function($root, $args) {
                        
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

    public function getQueryType(): ObjectType {
        return $this->queryType;
    }

    public function getMutationType(): ObjectType {
        return $this->mutationType;
    }
}
?>