<?php
session_start();
session_destroy();

if (isset($_COOKIE["username"])) {
    setcookie("username", "", time() - 3600);
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Logout</title>
</head>
<body>

<h2>You have been logged out</h2>
<a href="login.php">Login Again</a>

</body>
</html>
