<?php
namespace App\Types;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

class PriceType extends AbstractType {
    public function __construct() {
        $config = [
            'name' => 'Price',
            'fields' => [
                'amount' => Type::float(),
                'currency_label' => Type::string(),
            ],
        ];
        parent::__construct($config);
    }
}
?>