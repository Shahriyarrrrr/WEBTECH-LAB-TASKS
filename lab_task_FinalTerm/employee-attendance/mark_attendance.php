<?php
require "db.php";

$emps = $conn->query("SELECT emp_id, first_name, last_name FROM employees");

$msg = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $emp = $_POST["emp"];
    $date = $_POST["date"];
    $in = $_POST["in"];
    $out = $_POST["out"];
    $status = $_POST["status"];

    $c = $conn->prepare("SELECT attendance_id FROM attendance WHERE emp_id=? AND date=?");
    $c->bind_param("is", $emp, $date);
    $c->execute();
    $c->store_result();

    if ($c->num_rows > 0) {
        $msg = "Attendance already marked";
    } else {
        $q = $conn->prepare("INSERT INTO attendance (emp_id,date,check_in_time,check_out_time,status) VALUES (?,?,?,?,?)");
        $q->bind_param("issss", $emp, $date, $in, $out, $status);
        $q->execute();
        $msg = "Attendance recorded";
    }
}
?>

<!DOCTYPE html>
<html>
<body>

<h2>Mark Attendance</h2>

<form method="post">
<select name="emp">
<?php while ($e = $emps->fetch_assoc()) { ?>
<option value="<?php echo $e["emp_id"]; ?>">
<?php echo $e["first_name"]." ".$e["last_name"]; ?>
</option>
<?php } ?>
</select><br><br>

<input type="date" name="date" value="<?php echo date("Y-m-d"); ?>"><br><br>
<input type="time" name="in"><br><br>
<input type="time" name="out"><br><br>

<select name="status">
<option>Present</option>
<option>Absent</option>
<option>Late</option>
<option>Half-Day</option>
</select><br><br>

<button>Submit</button>
</form>

<p><?php echo $msg; ?></p>

<a href="report.php">View Report</a>

</body>
</html>
