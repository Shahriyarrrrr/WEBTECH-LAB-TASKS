<?php
session_start();

if (!isset($_SESSION["username"])) {
    header("Location: login.php");
    exit;
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Dashboard</title>
</head>
<body>

<h2>Welcome <?php echo $_SESSION["username"]; ?></h2>
<p>Role: <?php echo $_SESSION["user_role"]; ?></p>
<p>Login Time: <?php echo $_SESSION["login_time"]; ?></p>

<a href="profile.php">Profile</a><br><br>
<a href="logout.php">Logout</a>

</body>
</html>

