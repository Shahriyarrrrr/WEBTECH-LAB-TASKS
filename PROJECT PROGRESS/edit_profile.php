<?php
session_start();
require "db.php";

if (!isset($_SESSION["user_id"])) {
    header("Location: login.html");
    exit();
}

$id = $_SESSION["user_id"];

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name = trim($_POST["name"]);
    $email = trim($_POST["email"]);

    $stmt = mysqli_prepare($conn, "UPDATE users SET full_name=?, email=? WHERE id=?");
    mysqli_stmt_bind_param($stmt, "ssi", $name, $email, $id);
    mysqli_stmt_execute($stmt);

    $_SESSION["user_name"] = $name;
    header("Location: profile.php");
    exit();
}

$stmt = mysqli_prepare($conn, "SELECT full_name, email FROM users WHERE id=?");
mysqli_stmt_bind_param($stmt, "i", $id);
mysqli_stmt_execute($stmt);
mysqli_stmt_bind_result($stmt, $name, $email);
mysqli_stmt_fetch($stmt);
?>

<form method="POST">
  <input type="text" name="name" value="<?php echo $name; ?>" required>
  <input type="email" name="email" value="<?php echo $email; ?>" required>
  <button type="submit">Update Profile</button>
</form>
