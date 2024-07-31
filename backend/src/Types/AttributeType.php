<?php
namespace App\Types;

use GraphQL\Type\Definition\Type;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Error\UserError;
use App\Config\DB;

class AttributeType extends ObjectType {
    public function __construct() {
        $config = [
            'fields' => [
                'Id' => Type::nonNull(Type::id()),
                'name' => Type::nonNull(Type::string()),
                'type' => Type::nonNull(Type::string()),
                'Items' => [
                    'type' => Type::listOf(new ObjectType([
                        'name' => 'AttributeItem',
                        'fields' => [
                            'id' => Type::nonNull(Type::id()),
                            'name' => Type::nonNull(Type::string()),
                            'value' => Type::nonNull(Type::string()),
                        ],
                    ])),
                    'resolve' => function($attribute, $args, $context){
                        return $this->getItemsByAttributeId($attribute['Id']);
                    }
                ],
            ],
        ];
        parent::__construct($config);
    }

    private function getItemsByAttributeId($attributeId){
        $mysqli = null;
        try {
            $mysqli = DB::getConnection();
            if (!$mysqli) {
                throw new \Exception('Failed to connect to the database');
            }

            $stmt = $mysqli->prepare('SELECT id, name, value FROM attributeitems WHERE set_ID = ?');
            if (!$stmt) {
                throw new \Exception('Failed to prepare statement: ' . $mysqli->error);
            }

            $stmt->bind_param('i', $attributeId);
            $stmt->execute();
            $result = $stmt->get_result();
            
            return $result->fetch_all(MYSQLI_ASSOC);
        } catch (\Exception $e) {
            error_log('Error: ' . $e->getMessage());
            throw new UserError('Internal server error: ' . $e->getMessage());
        } finally {
            if ($mysqli && $mysqli->ping()) {
                DB::closeConnection();
            }
        }
    }
}
?>