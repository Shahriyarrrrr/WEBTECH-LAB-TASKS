<?php
session_start();
require "db.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $email = trim($_POST["email"]);
    $password = trim($_POST["password"]);

    if ($email === "" || $password === "") {
        $_SESSION["error"] = "All fields are required";
        header("Location: login.html");
        exit();
    }

    $stmt = mysqli_prepare($conn, "SELECT id, full_name, password, role FROM users WHERE email = ?");
    mysqli_stmt_bind_param($stmt, "s", $email);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_store_result($stmt);

    if (mysqli_stmt_num_rows($stmt) === 1) {

        mysqli_stmt_bind_result($stmt, $id, $name, $hashedPassword, $role);
        mysqli_stmt_fetch($stmt);

        if (password_verify($password, $hashedPassword)) {

            $_SESSION["user_id"] = $id;
            $_SESSION["name"] = $name;
            $_SESSION["role"] = $role;

            header("Location: index.html");
            exit();
        }
    }

    $_SESSION["error"] = "Invalid login credentials";
    header("Location: login.html");
}
?>
