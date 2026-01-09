<?php
require "db_connect.php";

$id = $_GET["id"];

$r = mysqli_query($conn, "SELECT * FROM students WHERE id=$id");
$s = mysqli_fetch_assoc($r);
$msg = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name = $_POST["name"];
    $email = $_POST["email"];
    $dept = $_POST["dept"];

    $q = "UPDATE students SET name='$name', email='$email', department='$dept' WHERE id=$id";
    if (mysqli_query($conn, $q)) {
        $msg = "Student updated successfully";
    }
}
?>

<!DOCTYPE html>
<html>
<body>

<h2>Edit Student</h2>

<form method="post">
<input name="name" value="<?php echo $s["name"]; ?>"><br><br>
<input name="email" value="<?php echo $s["email"]; ?>"><br><br>
<input name="dept" value="<?php echo $s["department"]; ?>"><br><br>
<button>Update</button>
</form>

<p><?php echo $msg; ?></p>
<a href="index.php">Back</a>

</body>
</html>
