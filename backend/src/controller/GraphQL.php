<?php
namespace App\Controller;

use GraphQL\GraphQL as GraphQLBase;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use GraphQL\Type\Schema;
use GraphQL\Type\SchemaConfig;
use RuntimeException;
use Throwable;

use App\Schema\CategorySchema;
use App\Schema\ProductSchema;

class GraphQL {
    static public function handle() {
        try {
            $categorySchema = new CategorySchema();
            $productSchema = new ProductSchema();

            $queryType = new ObjectType([
                'name' => 'Query',
                'fields' => array_merge(
                    $categorySchema->getQueryType()->getFields(),
                    $productSchema->getQueryType()->getFields()
                )
            ]);

            $schema = new Schema(
                (new SchemaConfig())
                ->setQuery($queryType)
            );

            $rawInput = file_get_contents('php://input');
            if ($rawInput === false) {
                throw new RuntimeException('Failed to get php://input');
            }

            $input = json_decode($rawInput, true);
            $query = $input['query'];
            $variableValues = $input['variables'] ?? null;

            $rootValue = ['prefix' => 'You said: '];
            $result = GraphQLBase::executeQuery($schema, $query, $rootValue, null, $variableValues);
            $output = $result->toArray();
        } catch (Throwable $e) {
            $output = [
                'error' => [
                    'message' => $e->getMessage(),
                ],
            ];
        }

        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode($output);
        exit();
    }
}
?>