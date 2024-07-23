<?php
namespace App\Schema;

use App\Config\DB;
use App\Schema\AbstractSchema;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

class CategorySchema extends AbstractSchema {
    protected function getQueryType(): ObjectType {
        return new ObjectType([
            'name' => 'Query',
            'fields' => [
                'categories' => [
                    'type' => Type::listOf(new ObjectType([
                        'name' => 'Category',
                        'fields' => [
                            'name' => Type::nonNull(Type::string()),
                            '__typename' => Type::nonNull(Type::string()),
                        ],
                    ])),
                    'resolve' => function() {
                        $mysqli = DB::getConnection();
                        $result = $mysqli->query('SELECT name, "Category" as __typename FROM categories');
                        $categories = [];

                        while ($row = $result->fetch_assoc()) {
                            $categories[] = $row;
                        }

                        DB::closeConnection();
                        return $categories;
                    }
                ]
            ]
        ]);
    }
}

?>