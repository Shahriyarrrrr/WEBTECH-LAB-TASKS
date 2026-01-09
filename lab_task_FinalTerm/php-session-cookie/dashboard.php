<?php
session_start();

if (!isset($_SESSION["username"])) {
    header("Location: login.php");
    exit;
}

$username = $_SESSION["username"];
$cookieUser = $_COOKIE["username"] ?? "";
?>

<!DOCTYPE html>
<html>
<head>
    <title>Dashboard</title>
</head>
<body>

<h2>Welcome <?php echo $username; ?></h2>
<p>Session Username: <?php echo $username; ?></p>

<?php
if ($cookieUser !== "") {
    echo "<p>Cookie is set: $cookieUser</p>";
} else {
    echo "<p>Cookie is not set</p>";
}
?>

<p>Session ID: <?php echo session_id(); ?></p>

<?php
if ($cookieUser !== "") {
    echo "<p>Cookie Value: $cookieUser</p>";
}
?>

<a href="logout.php">Logout</a>

</body>
</html>
