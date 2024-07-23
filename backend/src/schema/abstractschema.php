<?php
namespace App\Schema;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use GraphQL\Type\Schema;
use GraphQL\GraphQL;

abstract class AbstractSchema {
    protected $queryType;
    protected $mutationType;

    abstract public function getSchema(): Schema;
}
?>