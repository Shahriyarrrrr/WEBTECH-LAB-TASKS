<?php
session_start();

if (!isset($_SESSION["username"])) {
    header("Location: login.php");
    exit;
}

$user = $_SESSION["username"];
$cookieUser = $_COOKIE["username"] ?? "";
?>

<!DOCTYPE html>
<html>
<head>
    <title>Dashboard</title>
</head>
<body>

<h2>Welcome <?php echo $user; ?></h2>

<?php
if ($cookieUser !== "") {
    echo "<p>Username cookie is set</p>";
} else {
    echo "<p>No username cookie found</p>";
}
?>

<a href="logout.php">Logout</a>

</body>
</html>
