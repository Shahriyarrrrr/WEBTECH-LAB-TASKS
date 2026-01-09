<?php
session_start();

$validUser = "student";
$validPass = "aiub123";

$user = $_POST["username"] ?? "";
$pass = $_POST["password"] ?? "";

if ($user === $validUser && $pass === $validPass) {
    $_SESSION["username"] = $user;

    if (isset($_POST["remember"])) {
        setcookie("username", $user, time() + 604800);
    }

    header("Location: dashboard.php");
    exit;
} else {
    echo "Invalid login credentials<br>";
    echo "<a href='login.php'>Back to Login</a>";
}
