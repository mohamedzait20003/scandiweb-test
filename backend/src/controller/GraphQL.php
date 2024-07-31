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

class GraphQL {
    static public function handle() {
        try {
            $categorySchema = new CategorySchema();
            $productSchema = new ProductSchema();

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
            );

            $rawInput = file_get_contents('php://input');
            if ($rawInput === false) {
                throw new RuntimeException('Failed to get php://input');
            }
            error_log($rawInput);

            $input = json_decode($rawInput, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new RuntimeException('Invalid JSON input: ' . json_last_error_msg());
            }
            error_log(print_r($input, true));

            $query = $input['query'] ?? null;
            if ($query === null) {
                throw new RuntimeException('No query provided in the input');
            }
            error_log($query);

            $variableValues = $input['variables'] ?? null;
            error_log(print_r($variableValues, true));
            
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

        error_log(print_r($output, true));

        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode($output);
        exit();
    }
}
?>