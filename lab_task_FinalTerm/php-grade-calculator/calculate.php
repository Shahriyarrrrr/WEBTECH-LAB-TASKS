<?php
session_start();

if (
    empty($_POST["name"]) ||
    $_POST["m1"] === "" ||
    $_POST["m2"] === "" ||
    $_POST["m3"] === "" ||
    $_POST["m4"] === "" ||
    $_POST["m5"] === ""
) {
    header("Location: index.php");
    exit;
}

$marks = [$_POST["m1"], $_POST["m2"], $_POST["m3"], $_POST["m4"], $_POST["m5"]];

foreach ($marks as $m) {
    if ($m < 0 || $m > 100) {
        header("Location: index.php");
        exit;
    }
}

$total = array_sum($marks);
$average = $total / 5;

if ($average >= 90) $grade = "A";
elseif ($average >= 80) $grade = "B";
elseif ($average >= 70) $grade = "C";
elseif ($average >= 60) $grade = "D";
else $grade = "F";

$student = [
    "name" => htmlspecialchars($_POST["name"]),
    "total" => $total,
    "average" => $average,
    "grade" => $grade
];

$_SESSION["students"][] = $student;
?>

<!DOCTYPE html>
<html>
<head>
    <title>Result</title>
    <style>
        body { font-family: Arial; background: #f2f2f2; }
        .box { width: 400px; margin: 40px auto; background: #fff; padding: 20px; }
        table { width: 100%; border-collapse: collapse; }
        td { border: 1px solid #000; padding: 8px; }
        a { display: block; margin-top: 10px; text-align: center; }
    </style>
</head>
<body>

<div class="box">
    <table>
        <tr><td>Name</td><td><?php echo $student["name"]; ?></td></tr>
        <tr><td>Total</td><td><?php echo $total; ?></td></tr>
        <tr><td>Average</td><td><?php echo $average; ?></td></tr>
        <tr><td>Grade</td><td><?php echo $grade; ?></td></tr>
    </table>
    <a href="index.php">Add Another</a>
    <a href="results.php">View All Results</a>
</div>

</body>
</html>
