<?php
require "db.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $f = $_POST["first"];
    $l = $_POST["last"];
    $e = $_POST["email"];
    $d = $_POST["dept"];
    $j = $_POST["join"];

    $q = $conn->prepare("INSERT INTO employees (first_name,last_name,email,department,join_date) VALUES (?,?,?,?,?)");
    $q->bind_param("sssss", $f, $l, $e, $d, $j);
    $q->execute();
}

$r = $conn->query("SELECT * FROM employees ORDER BY join_date DESC");
?>

<!DOCTYPE html>
<html>
<body>

<h2>Manage Employees</h2>

<form method="post">
<input name="first" placeholder="First Name"><br><br>
<input name="last" placeholder="Last Name"><br><br>
<input name="email" placeholder="Email"><br><br>
<input name="dept" placeholder="Department"><br><br>
<input type="date" name="join"><br><br>
<button>Add Employee</button>
</form>

<h3>Employee List</h3>

<table border="1" cellpadding="8">
<tr>
<th>ID</th><th>Name</th><th>Email</th><th>Department</th><th>Join Date</th>
</tr>
<?php while ($e = $r->fetch_assoc()) { ?>
<tr>
<td><?php echo $e["emp_id"]; ?></td>
<td><?php echo $e["first_name"]." ".$e["last_name"]; ?></td>
<td><?php echo $e["email"]; ?></td>
<td><?php echo $e["department"]; ?></td>
<td><?php echo $e["join_date"]; ?></td>
</tr>
<?php } ?>
</table>

<a href="mark_attendance.php">Mark Attendance</a> |
<a href="report.php">View Report</a>

</body>
</html>
