<?php
namespace App\Config;

use Dotenv\Dotenv;
use mysqli;

class DB {
    private static $conn;

    private function __construct() {
        $dotenv = Dotenv::createImmutable(__DIR__ . '/../..');
        $dotenv->load();

        $host = $_ENV['DB_HOST'];
        $user = $_ENV['DB_USER'];
        $pass = $_ENV['DB_PASS'];
        $name = $_ENV['DB_NAME'];
        $port = $_ENV['DB_PORT'];

        self::$conn = new mysqli($host, $user, $pass, $name, $port);
        if (self::$conn->connect_error) {
            throw new \Exception('Database connection error: ' . self::$conn->connect_error);
        }
    }

    public static function getConnection() {
        if (self::$conn === null) {
            new self();
        }
        return self::$conn;
    }

    public static function closeConnection() {
        if (self::$conn) {
            self::$conn->close();
            self::$conn = null;
        }
    }
}