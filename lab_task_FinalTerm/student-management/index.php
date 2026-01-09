<?php
require "db_connect.php";
$msg = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name = $_POST["name"];
    $email = $_POST["email"];
    $reg = $_POST["reg"];
    $dept = $_POST["dept"];

    $q = "INSERT INTO students (name,email,registration_no,department)
          VALUES ('$name','$email','$reg','$dept')";
    if (mysqli_query($conn, $q)) {
        $msg = "Student added successfully";
    }
}

$result = mysqli_query($conn, "SELECT * FROM students");
?>

<!DOCTYPE html>
<html>
<head>
    <title>Student Management</title>
</head>
<body>

<h2>Add Student</h2>

<form method="post">
<input name="name" placeholder="Student Name" required><br><br>
<input name="email" placeholder="Email" required><br><br>
<input name="reg" placeholder="Registration Number" required><br><br>
<input name="dept" placeholder="Department" required><br><br>
<button>Add</button>
</form>

<p><?php echo $msg; ?></p>

<h2>Student Records</h2>

<table border="1" cellpadding="8">
<tr>
<th>Name</th>
<th>Email</th>
<th>Registration No</th>
<th>Department</th>
<th>Action</th>
</tr>

<?php while ($s = mysqli_fetch_assoc($result)) { ?>
<tr>
<td><?php echo $s["name"]; ?></td>
<td><?php echo $s["email"]; ?></td>
<td><?php echo $s["registration_no"]; ?></td>
<td><?php echo $s["department"]; ?></td>
<td>
<a href="edit.php?id=<?php echo $s["id"]; ?>">Edit</a> |
<a href="delete.php?id=<?php echo $s["id"]; ?>">Delete</a>
</td>
</tr>
<?php } ?>

</table>

</body>
</html>
