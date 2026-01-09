<?php
session_start();

$validUser = "admin";
$validPass = "1234";

$username = $_POST["username"] ?? "";
$password = $_POST["password"] ?? "";

if ($username === $validUser && $password === $validPass) {
    $_SESSION["username"] = $username;

    if (isset($_POST["remember"])) {
        setcookie("username", $username, time() + 86400);
    }

    header("Location: dashboard.php");
    exit;
} else {
    echo "Invalid credentials<br>";
    echo "<a href='login.php'>Back to Login</a>";
}
?>
