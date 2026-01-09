<?php
require "db.php";

$emp = $_GET["emp"] ?? "";
$from = $_GET["from"] ?? "2000-01-01";
$to = $_GET["to"] ?? date("Y-m-d");

$sql = "SELECT a.*, e.first_name, e.last_name FROM attendance a
JOIN employees e ON a.emp_id=e.emp_id
WHERE a.date BETWEEN ? AND ?";

if ($emp !== "") {
    $sql .= " AND e.emp_id=?";
}

$sql .= " ORDER BY a.date DESC";

$q = $conn->prepare($emp !== "" ? $sql : $sql);
if ($emp !== "") {
    $q->bind_param("ssi", $from, $to, $emp);
} else {
    $q->bind_param("ss", $from, $to);
}
$q->execute();
$r = $q->get_result();

$p=$a=$l=$t=0;
?>

<!DOCTYPE html>
<html>
<body>

<h2>Attendance Report</h2>

<form method="get">
<input type="date" name="from">
<input type="date" name="to">
<input type="number" name="emp" placeholder="Employee ID">
<button>Filter</button>
</form>

<table border="1" cellpadding="8">
<tr>
<th>Name</th><th>Date</th><th>Status</th><th>Check In</th><th>Check Out</th>
</tr>
<?php while ($row = $r->fetch_assoc()) {
    $t++;
    if ($row["status"]==="Present") $p++;
    if ($row["status"]==="Absent") $a++;
    if ($row["status"]==="Late") $l++;
?>
<tr>
<td><?php echo $row["first_name"]." ".$row["last_name"]; ?></td>
<td><?php echo $row["date"]; ?></td>
<td><?php echo $row["status"]; ?></td>
<td><?php echo $row["check_in_time"]; ?></td>
<td><?php echo $row["check_out_time"]; ?></td>
</tr>
<?php } ?>
</table>

<h3>Statistics</h3>
<p>Total Present: <?php echo $p; ?></p>
<p>Total Absent: <?php echo $a; ?></p>
<p>Total Late: <?php echo $l; ?></p>
<p>Attendance Percentage: <?php echo $t ? round(($p/$t)*100,2) : 0; ?>%</p>

<a href="manage_employees.php">Manage Employees</a>

</body>
</html>
