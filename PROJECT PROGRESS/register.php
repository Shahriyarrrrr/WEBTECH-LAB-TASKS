<?php
session_start();
require "db.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $name = trim($_POST["name"]);
    $email = trim($_POST["email"]);
    $password = trim($_POST["password"]);
    $role = $_POST["role"];

    if ($name === "" || $email === "" || $password === "" || $role === "") {
        $_SESSION["error"] = "All fields are required";
        header("Location: register.html");
        exit();
    }

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    $stmt = mysqli_prepare($conn, "INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)");
    mysqli_stmt_bind_param($stmt, "ssss", $name, $email, $hashedPassword, $role);

    if (mysqli_stmt_execute($stmt)) {
        $_SESSION["success"] = "Registration successful";
        header("Location: login.html");
    } else {
        $_SESSION["error"] = "Email already exists";
        header("Location: register.html");
    }

    mysqli_stmt_close($stmt);
}
?>
