<?php
$host = "localhost";
$user = "root";
$password = "";
$database = "aiub_webtech";

$conn = mysqli_connect($host, $user, $password, $database);

if ($conn) {
    echo "Database connected successfully.";
} else {
    echo mysqli_connect_error();
}

mysqli_close($conn);
