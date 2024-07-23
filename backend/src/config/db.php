<?php
class DB {
    private static $conn = null;

    public function __construct() {
        if (self::$conn === null) {
            $host = 'localhost';
            $user = 'root';
            $pass = 'Adsbc1234567@';
            $name = 'ecommercetest';
            $port = '3306';

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