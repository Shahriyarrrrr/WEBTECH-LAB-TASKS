<?php
$name = "";
$department = "";
$days = "";
$status = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name = $_POST["name"] ?? "";
    $department = $_POST["department"] ?? "";
    $days = $_POST["days"] ?? "";

    if ($days <= 5) {
        $status = "Leave Approved";
    } else {
        $status = "Pending Approval";
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Leave Request Evaluation</title>
</head>
<body>

<form method="post">
    <label>Employee Name:</label><br>
    <input type="text" name="name" value="<?php echo $name; ?>"><br><br>

    <label>Department:</label><br>
    <input type="text" name="department" value="<?php echo $department; ?>"><br><br>

    <label>Number of Leave Days:</label><br>
    <input type="number" name="days" value="<?php echo $days; ?>"><br><br>

    <button type="submit">Submit</button>
</form>

<?php
if ($status !== "") {
    echo "<h3>Employee Name: $name</h3>";
    echo "<h3>Department: $department</h3>";
    echo "<h3>Leave Days: $days</h3>";
    echo "<h3>Status: $status</h3>";
}
?>

</body>
</html>
