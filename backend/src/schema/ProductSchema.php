<?php
namespace App\Schema;

require_once __DIR__ . '/../../vendor/autoload.php';

use App\Config\DB;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use GraphQL\Error\UserError;

use App\Types\ProductType;

class ProductSchema extends AbstractSchema {
    public function __construct() {
        $this->queryType = new ObjectType([
            'name' => 'Query',
            'fields' => [
                'Products' => [
                    'type' => Type::listOf(new ProductType()),
                    'args' => [
                        'category_name' => Type::string()
                    ],
                    'resolve' => function($root, $args, $context) {
                        return $this->fetchProducts($args['category_name'] ?? null);
                    }
                ]
            ]
        ]);
    }

    private function fetchProducts($category_name = null) {
        $mysqli = null;
        try {
            $mysqli = DB::getConnection();
            if (!$mysqli) {
                throw new \Exception('Failed to connect to the database');
            }

            $query = 'SELECT Id, name, inStock, description, brand FROM product';
            if ($category_name !== null) {
                $query .= ' WHERE category_id IN (SELECT id FROM category WHERE Name = ?)';
            }

            $stmt = $mysqli->prepare($query);
            if ($category_name !== null) {
                $stmt->bind_param('s', $category_name);
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