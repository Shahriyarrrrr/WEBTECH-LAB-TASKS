<?php
require "db_connect.php";

$students = [
    ["John Doe","john@example.com",22,"CSE"],
    ["Alice Smith","alice@example.com",21,"EEE"],
    ["Bob Khan","bob@example.com",23,"BBA"]
];

foreach ($students as $s) {
    $sql = "INSERT INTO students (name,email,age,department)
            VALUES ('$s[0]','$s[1]',$s[2],'$s[3]')";

    if (mysqli_query($conn, $sql)) {
        echo "Record inserted successfully<br>";
    } else {
        echo mysqli_error($conn) . "<br>";
    }
}

mysqli_close($conn);
