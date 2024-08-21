<?php
namespace App\Controller;
require_once __DIR__ . '/../../vendor/autoload.php';

use GraphQL\GraphQL as GraphQLBase;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Schema;
use GraphQL\Type\SchemaConfig;
use RuntimeException;
use Throwable;

use App\Schema\CategorySchema;
use App\Schema\ProductSchema;
use App\Schema\OrderSchema;

class GraphQL {
    static public function handle() {
        try {
            $categorySchema = new CategorySchema();
            $productSchema = new ProductSchema();
            $orderSchema = new OrderSchema();

            $combinedQueryFields = array_merge(
                $categorySchema->getQueryType()->getFields(),
                $productSchema->getQueryType()->getFields()
            );

            $combinedQueryType = new ObjectType([
                'name' => 'Query',
                'fields' => $combinedQueryFields
            ]);

            $schema = new Schema(
                (new SchemaConfig())
                ->setQuery($combinedQueryType)
                ->setMutation($orderSchema->getMutationType())
            );

            $rawInput = file_get_contents('php://input');
            if ($rawInput === false) {
                throw new RuntimeException('Failed to get php://input');
            }

            $input = json_decode($rawInput, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new RuntimeException('Invalid JSON input: ' . json_last_error_msg());
            }

            $query = $input['query'] ?? null;
            if ($query === null) {
                throw new RuntimeException('No query provided in the input');
            }

            $variableValues = $input['variables'] ?? null;

            $rootValue = ['prefix' => 'You said: '];
            $result = GraphQLBase::executeQuery($schema, $query, $rootValue, null, $variableValues);
            $output = $result->toArray();
        } catch (Throwable $e) {
            error_log('Error: ' . $e->getMessage());
            error_log('Trace: ' . $e->getTraceAsString());
            $output = [
                'error' => [
                    'message' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                ],
            ];
        }

        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode($output);
        exit();
    }
}
?>