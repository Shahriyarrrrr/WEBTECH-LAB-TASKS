<?php
session_start();
require "db.php";

if (!isset($_SESSION["user_id"])) {
    header("Location: login.html");
    exit();
}

$id = $_SESSION["user_id"];

$stmt = mysqli_prepare($conn, "SELECT full_name, email, role, created_at FROM users WHERE id = ?");
mysqli_stmt_bind_param($stmt, "i", $id);
mysqli_stmt_execute($stmt);
mysqli_stmt_bind_result($stmt, $name, $email, $role, $created);
mysqli_stmt_fetch($stmt);
?>
<!DOCTYPE html>
<html>
<head>
  <title>My Profile</title>
</head>
<body>

<h2>My Profile</h2>

<p>Name: <?php echo $name; ?></p>
<p>Email: <?php echo $email; ?></p>
<p>Role: <?php echo $role; ?></p>
<p>Joined: <?php echo $created; ?></p>

<a href="edit_profile.php">Edit Profile</a>
<a href="delete_account.php">Delete Account</a>
<a href="logout.php">Logout</a>

</body>
</html>
