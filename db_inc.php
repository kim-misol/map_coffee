<?php
// $mysql_hostname = 'http://kimmisol.com';
$mysql_hostname = 'localhost';
$mysql_username = 'kimmisol_bot';
$mysql_password = 'K!MM!$OLBOT';
$mysql_database = 'kimmisol_map_coffee';
$mysql_port = '3306';

// connecting DB
$connect = mysqli_connect($mysql_hostname, $mysql_username , $mysql_password , $mysql_database );
// choose DB
// mysqli_select_db($connect, $mysql_database) or die('Failed to connect DB');

if (!$connect) {
    echo "Error: Unable to connect to MySQL." . PHP_EOL;
    echo "Debugging errno: " . mysqli_connect_errno() . PHP_EOL;
    echo "Debugging error: " . mysqli_connect_error() . PHP_EOL;
    exit;
}

echo "Success: A proper connection to MySQL was made! The my_db database is great." . PHP_EOL;
echo "Host information: " . mysqli_get_host_info($connect) . PHP_EOL;

mysqli_close($connect);
?>