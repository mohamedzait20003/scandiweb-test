<?php 
namespace App\Types;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

class ProductType extends AbstractType {
    public function __construct() {
        $config = [
            'name' => 'Product',
            'fields' => [
                'id' => Type::nonNull(Type::id()),
                'name' => Type::nonNull(Type::string()),
                'inStock' => Type::nonNull(Type::boolean()),
                'description' => Type::string(),
                'category_id' => Type::int(),
                'brand' => Type::string(),
                'galleries' => Type::listOf(new GalleryType()),
                'price' => new PriceType(),
                'attributeSets' => Type::listOf(new AttributeSetType()),
            ],
        ];
        parent::__construct($config);
    }
}
?>