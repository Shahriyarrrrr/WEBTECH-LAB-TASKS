<?php
require "db_connect.php";

$id = $_GET["id"];

if (mysqli_query($conn, "DELETE FROM students WHERE id=$id")) {
    echo "Student deleted successfully";
}
?>

<br>
<a href="index.php">Back</a>
