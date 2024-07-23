<?php
namespace App\Types;

use GraphQL\Type\Definition\ObjectType;

abstract class AbstractType extends ObjectType {
    protected $type;

    public function __construct(array $config) {
        parent::__construct($config);
        $this->type = $config['type'] ?? null;
    }
}
?>