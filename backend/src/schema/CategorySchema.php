<?php
namespace App\Schema;

require_once __DIR__ . '/../../vendor/autoload.php';

use App\Config\DB;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use GraphQL\Type\Schema;
use App\Types\CategoryType;

class CategorySchema extends AbstractSchema {
    protected $queryType;
    protected $mutationType;

    public function __construct() {
        $this->queryType = new ObjectType([
            'name' => 'Query',
            'fields' => [
                'categories' => [
                    'type' => Type::listOf(new CategoryType()),
                    'resolve' => function() {
                        try {
                            $mysqli = DB::getConnection();
                            if (!$mysqli) {
                                throw new \Exception('Failed to connect to the database');
                            }
                    
                            $result = $mysqli->query('SELECT id, name FROM categories');
                            
                            if (!$result) {
                                throw new \Exception('Database query error: ' . $mysqli->error);
                            }
                    
                            $categories = [];
                            while ($row = $result->fetch_assoc()) {
                                $categories[] = $row;
                            }
                    
                            DB::closeConnection();
                            return $categories;
                        } catch (\Exception $e) {
                            error_log('Error in CategorySchema resolve: ' . $e->getMessage());
                            throw new \Exception('Internal server error');
                        }
                    }
                ]
            ]
        ]);
        $this->mutationType = null;
    }

    public function getSchema(): Schema {
        return new Schema([
            'query' => $this->queryType,
            'mutation' => $this->mutationType,
        ]);
    }
}