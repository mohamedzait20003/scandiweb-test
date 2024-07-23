<?php
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use GraphQL\Type\Schema;
use GraphQL\GraphQL;

abstract class AbstractSchema {
    abstract protected function getQueryType(): ObjectType;

    public function getSchema(): Schema {
        return new Schema([
            'query' => $this->getQueryType(),
        ]);
    }
}
?>