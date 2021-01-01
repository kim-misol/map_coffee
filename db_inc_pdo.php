<?php
// $mysql_hostname = 'http://kimmisol.com';
$mysql_hostname = 'localhost';
$mysql_username = 'kimmisol_bot';
$mysql_password = 'K!MM!$OLBOT';
$mysql_database = 'kimmisol_map_coffee';
$mysql_port = '3306';

/* Connection string, or "data source name" */
$dsn = 'mysql:host=' . $mysql_hostname . ';dbname=' . $mysql_database;

/* Connection inside a try/catch block */
try
{  
   /* PDO object creation */
   $pdo = new PDO($dsn, $mysql_username,  $mysql_password);
   
   /* Enable exceptions on errors */
   $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
}
catch (PDOException $e)
{
   /* If there is an error an exception is thrown */
   echo 'Connection failed<br>';
   echo 'Error number: ' . $e->getCode() . '<br>';
   echo 'Error message: ' . $e->getMessage() . '<br>';
   die();
}

echo 'Successfully connected!<br>';
?>