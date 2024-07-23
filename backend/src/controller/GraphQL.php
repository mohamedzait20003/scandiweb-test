<?php
namespace App\Controller;
require_once __DIR__ . '/../../vendor/autoload.php';

use GraphQL\GraphQL as GraphQLBase;
use RuntimeException;
use Throwable;

use App\Schema\CategorySchema;

class GraphQL {
    static public function handle() {
        try {
            $categorySchema = new CategorySchema();
            $schema = $categorySchema->getSchema();

            $rawInput = file_get_contents('php://input');
            if ($rawInput === false) {
                throw new RuntimeException('Failed to get php://input');
            }

            error_log('Raw input: ' . $rawInput); // Log raw input

            $input = json_decode($rawInput, true);
            $query = $input['query'];
            $variableValues = $input['variables'] ?? null;

            error_log('Executing query: ' . $query); // Log the query

            $rootValue = ['prefix' => 'You said: '];
            $result = GraphQLBase::executeQuery($schema, $query, $rootValue, null, $variableValues);
            $output = $result->toArray();

            error_log('Query result: ' . json_encode($output)); // Log the result
        } catch (Throwable $e) {
            error_log('Error: ' . $e->getMessage()); // Log the error
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