<?php
namespace App\Types;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

class OrderType extends ObjectType {
    public function __construct() {
        $config = [
            'name' => 'Order',
            'fields' => [
                'total_quantity' => Type::nonNull(Type::int()),
                'date' => Type::nonNull(Type::string()),
                'items' => Type::listOf(new InputObjectType([
                    'name' => 'OrderItemInput',
                    'fields' => [
                        'product_id' => Type::nonNull(Type::int()),
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
            ],
        ];
        parent::__construct($config);
    }
}
?>