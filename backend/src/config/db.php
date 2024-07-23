<?php
namespace App\Config;

use Dotenv\Dotenv;
use mysqli;

class DB {
    private static $conn = null;

    public function __construct() {
        if (self::$conn === null) {
            $dotenv = Dotenv::createImmutable(__DIR__ . '/../..');
            $dotenv->load();

            $host = $_ENV['DB_HOST'];
            $user = $_ENV['DB_USER'];
            $pass = $_ENV['DB_PASS'];
            $name = $_ENV['DB_NAME'];
            $port = $_ENV['DB_PORT'];

            self::$conn = new mysqli($host, $user, $pass, $name, $port);
            if (self::$conn->connect_error) {
                die('Connect Error (' . self::$conn->connect_errno . ') ' . self::$conn->connect_error);
            }
        }
    }

    public static function getConnection() {
        if (self::$conn === null) {
            new self();
        }
        return self::$conn;
    }

    public static function closeConnection() {
        if (self::$connection) {
            self::$connection->close();
            self::$connection = null;
        }
    }
}
?>