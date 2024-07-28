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
                    'resolve' => function($root, $args) {
                        return $this->fetchProducts($args['category_id'] ?? null);
                    }
                ]
            ]
        ]);

        $this->mutationType = new ObjectType([
            'name' => 'Mutation',
            'fields' => [
                'createProduct' => [
                    'type' => new OrderType(),
                    'args' => [
                        // Define arguments here
                    ],
                    'resolve' => function($root, $args) {
                        // Define resolve function here
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
            if ($category_id) {
                $category_id = $mysqli->real_escape_string($category_id);
                $query .= " WHERE category_id = '$category_id'";
            }
    
            $result = $mysqli->query($query);
            if (!$result) {
                throw new \Exception('Database query error: ' . $mysqli->error);
            }
    
            $products = [];
            while($row = $result->fetch_assoc()){
                $productId = $row['Id'];
    
                $galleryResult = $mysqli->query("SELECT id, image_url FROM gallery WHERE product_id = '" . $mysqli->real_escape_string($productId) . "'");
                if (!$galleryResult) {
                    throw new \Exception('Gallery query error: ' . $mysqli->error);
                }
                $galleryItems = [];
                while ($galleryRow = $galleryResult->fetch_assoc()) {
                    $galleryItems[] = $galleryRow;
                }
                $row['gallery'] = $galleryItems;
    
                $priceResult = $mysqli->query("SELECT id, amount, currency_label, currency_symbol FROM price WHERE product_id = '" . $mysqli->real_escape_string($productId) . "'");
                if (!$priceResult) {
                    throw new \Exception('Price query error: ' . $mysqli->error);
                }
                $priceRow = $priceResult->fetch_assoc();
                $row['price'] = $priceRow;
    
                $products[] = $row;
            }
    
            return $products;
        } catch (\Exception $e) {
            error_log('Error: ' . $e->getMessage());
            throw new UserError('Internal server error: ' . $e->getMessage());
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