<?php
namespace App\Types;

require_once __DIR__ . '/../../vendor/autoload.php';

use App\Config\DB;
use GraphQL\Type\Definition\Type;
use GraphQL\Type\Definition\ObjectType;

class ProductType extends ObjectType {
    public function __construct() {
        $config = [
            'fields' => [
                'Id' => Type::nonNull(Type::id()),
                'name' => Type::nonNull(Type::string()),
                'inStock' => Type::nonNull(Type::boolean()),
                'description' => Type::string(),
                'brand' => Type::string(),
                'gallery' => [
                    'type' => Type::listOf(new ObjectType([
                        'name' => 'Image',
                        'fields' => [
                            'id' => Type::nonNull(Type::id()),
                            'image_url' => Type::nonNull(Type::string()),
                        ],
                    ])),
                    'resolve' => function($product, $args, $context){
                        return $this->fetchGallery($product['Id']);
                    }
                ],
                'price' => [
                    'type' => new ObjectType([
                        'name' => 'Price',
                        'fields' => [
                            'id' => Type::nonNull(Type::id()),
                            'amount' => Type::nonNull(Type::float()),
                            'currency_label' => Type::nonNull(Type::string()),
                            'currency_symbol' => Type::nonNull(Type::string()),
                        ],
                    ]), 
                    'resolve' => function($product, $args, $context){
                        return $this->fetchPrice($product['Id']);
                    }
                ],
                'AttributeSets' => [
                    'type' => Type::listOf(new AttributeType()),
                    'resolve' => function($product, $args, $context){
                        return $this->fetchAttributes($product['Id']);
                    }
                ],
            ],
        ];
        parent::__construct($config);
    }

    private function fetchGallery($productId) {
        $mysqli = null;
        try {
            $mysqli = DB::getConnection();
            if (!$mysqli) {
                throw new \Exception('Failed to connect to the database');
            }
    
            $stmt = $mysqli->prepare('SELECT id, image_url FROM gallery WHERE product_id = ?');
            if (!$stmt) {
                throw new \Exception('Failed to prepare statement: ' . $mysqli->error);
            }
    
            $stmt->bind_param('s', $productId);
            $stmt->execute();
            $result = $stmt->get_result();
            $galleryItems = $result->fetch_all(MYSQLI_ASSOC);
            error_log('Fetched gallery items for product_id ' . $productId . ': ' . json_encode($galleryItems));
    
            return $galleryItems;
        } catch (\Exception $e) {
            error_log('Error: ' . $e->getMessage());
            throw new \Exception('Internal server error: ' . $e->getMessage());
        } finally {
            if ($mysqli && $mysqli->ping()) {
                DB::closeConnection();
            }
        }
    }

    private function fetchPrice($productId) {
        $mysqli = null;
        try {
            $mysqli = DB::getConnection();
            if (!$mysqli) {
                throw new \Exception('Failed to connect to the database');
            }

            $stmt = $mysqli->prepare('SELECT id, amount, currency_label, currency_symbol FROM price WHERE product_id = ?');
            if (!$stmt) {
                throw new \Exception('Failed to prepare statement: ' . $mysqli->error);
            }

            $stmt->bind_param('s', $productId);
            $stmt->execute();
            $result = $stmt->get_result();
            return $result->fetch_assoc();

        } catch (\Exception $e) {
            error_log('Error: ' . $e->getMessage());
            throw new \Exception('Internal server error: ' . $e->getMessage());
        } finally {
            if ($mysqli && $mysqli->ping()) {
                DB::closeConnection();
            }
        }
    }

    private function fetchAttributes($productId) {
        $mysqli = null;
        try {
            $mysqli = DB::getConnection();
            if (!$mysqli) {
                throw new \Exception('Failed to connect to the database');
            }

            $stmt = $mysqli->prepare('SELECT Id, name, type FROM attributeset WHERE product_id = ?');
            if (!$stmt) {
                throw new \Exception('Failed to prepare statement: ' . $mysqli->error);
            }

            $stmt->bind_param('s', $productId);
            $stmt->execute();
            $result = $stmt->get_result();

            $attributes = $result->fetch_all(MYSQLI_ASSOC);
            error_log('Fetched attributes for product_id ' . $productId . ': ' . json_encode($attributes));

            return $attributes;
        } catch (\Exception $e) {
            error_log('Error: ' . $e->getMessage());
            throw new \Exception('Internal server error: ' . $e->getMessage());
        } finally {
            if ($mysqli && $mysqli->ping()) {
                DB::closeConnection();
            }
        }
    }
}
?>