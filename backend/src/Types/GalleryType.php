<?php
namespace App\Types;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

class GalleryType extends AbstractType {
    public function __construct() {
        $config = [
            'name' => 'Gallery',
            'fields' => [
                'id' => Type::nonNull(Type::id()),
                'image_url' => Type::string(),
            ],
        ];
        parent::__construct($config);
    }
}
?>