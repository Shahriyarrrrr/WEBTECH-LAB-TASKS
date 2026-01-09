<?php
require "db_connect.php";

$msg = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name = $_POST["name"];
    $email = $_POST["email"];
    $age = $_POST["age"];
    $department = $_POST["department"];

    $sql = "INSERT INTO students (name,email,age,department)
            VALUES ('$name','$email',$age,'$department')";

    if (mysqli_query($conn, $sql)) {
        $msg = "Registration Successful";
    } else {
        $msg = mysqli_error($conn);
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Student Registration</title>
</head>
<body>

<h2>Student Registration</h2>

<form method="post">
    <input type="text" name="name" placeholder="Name" required><br><br>
    <input type="email" name="email" placeholder="Email" required><br><br>
    <input type="number" name="age" placeholder="Age" required><br><br>
    <input type="text" name="department" placeholder="Department" required><br><br>
    <button type="submit">Register</button>
</form>

<p><?php echo $msg; ?></p>

</body>
</html>
