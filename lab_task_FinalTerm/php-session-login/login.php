<?php
session_start();

if (isset($_SESSION["username"])) {
    header("Location: dashboard.php");
    exit;
}

$error = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if ($_POST["username"] === "admin" && $_POST["password"] === "admin123") {
        $_SESSION["username"] = "admin";
        $_SESSION["login_time"] = date("Y-m-d H:i:s");
        $_SESSION["user_role"] = "Administrator";
        header("Location: dashboard.php");
        exit;
    } else {
        $error = "Invalid username or password";
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Login</title>
</head>
<body>

<h2>Login</h2>

<form method="post">
    <label>Username:</label><br>
    <input type="text" name="username"><br><br>

    <label>Password:</label><br>
    <input type="password" name="password"><br><br>

    <button type="submit">Login</button>
</form>

<?php
if ($error !== "") {
    echo "<p>$error</p>";
}
?>

</body>
</html>
