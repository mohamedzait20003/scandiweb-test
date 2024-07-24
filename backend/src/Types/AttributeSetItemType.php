<?php
namespace App\Types;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

class AttributeSetItemType extends AbstractType {
    public function __construct() {
        $config = [
            'name' => 'AttributeSetItem',
            'fields' => [
                'displayValue' => Type::string(),
                'value' => Type::string(),
            ],
        ];
        parent::__construct($config);
    }
}
?>