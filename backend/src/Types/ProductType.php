<?php 
namespace App\Types;

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
                'gallery' => Type::listOf(new ObjectType([
                    'name' => 'Image',
                    'fields' => [
                        'id' => Type::nonNull(Type::id()),
                        'image_url' => Type::nonNull(Type::string()),
                    ],
                ])),
                'price' => new ObjectType([
                    'name' => 'Price',
                    'fields' => [
                        'id' => Type::nonNull(Type::id()),
                        'amount' => Type::nonNull(Type::float()),
                        'currency_label' => Type::nonNull(Type::string()),
                        'currency_symbol' => Type::nonNull(Type::string()),
                    ],
                ]),
            ],
        ];
        parent::__construct($config);
    }
}

?>