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
            'name' => 'CategoryQuery',
            'fields' => [
                'categories' => [
                    'type' => Type::listOf(new CategoryType()),
                    'resolve' => function() {
                        return $this->fetchCategories();
                    }
                ]
            ]
        ]);
        $this->mutationType = null;
    }

    private function fetchCategories() {
        $mysqli = null;
        try {
            $mysqli = DB::getConnection();
            if (!$mysqli) {
                throw new \Exception('Failed to connect to the database');
            }
    
            $result = $mysqli->query('SELECT id, name FROM category');
            
            if (!$result) {
                throw new \Exception('Database query error: ' . $mysqli->error);
            }
    
            $categories = [];
            while ($row = $result->fetch_assoc()) {
                $categories[] = $row;
            }

            return $categories;
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