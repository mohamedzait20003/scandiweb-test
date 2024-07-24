<?php
namespace App\Types;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

class AttributeSetType extends AbstractType {
    public function __construct() {
        $config = [
            'name' => 'AttributeSet',
            'fields' => [
                'name' => Type::nonNull(Type::string()),
                'type' => Type::nonNull(Type::string()),
                'items' => Type::listOf(new AttributeSetItemType()),
            ],
        ];
        parent::__construct($config);
    }
}
?>