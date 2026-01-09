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
    <title>Profile</title>
</head>
<body>

<h2>User Profile</h2>
<p>Username: <?php echo $_SESSION["username"]; ?></p>
<p>Role: <?php echo $_SESSION["user_role"]; ?></p>
<p>Login Time: <?php echo $_SESSION["login_time"]; ?></p>

<a href="dashboard.php">Back to Dashboard</a><br><br>
<a href="logout.php">Logout</a>

</body>
</html>
