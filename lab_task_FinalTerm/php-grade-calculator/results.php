<?php
session_start();

if (isset($_POST["clear"])) {
    session_destroy();
    header("Location: results.php");
    exit;
}

$students = $_SESSION["students"] ?? [];
?>

<!DOCTYPE html>
<html>
<head>
    <title>All Results</title>
    <style>
        body { font-family: Arial; background: #f2f2f2; }
        .box { width: 600px; margin: 40px auto; background: #fff; padding: 20px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #000; padding: 8px; text-align: center; }
        a, button { margin-top: 10px; display: inline-block; }
    </style>
</head>
<body>

<div class="box">
    <table>
        <tr>
            <th>Name</th>
            <th>Total</th>
            <th>Average</th>
            <th>Grade</th>
        </tr>
        <?php
        foreach ($students as $s) {
            echo "<tr>
                    <td>{$s["name"]}</td>
                    <td>{$s["total"]}</td>
                    <td>{$s["average"]}</td>
                    <td>{$s["grade"]}</td>
                  </tr>";
        }
        ?>
    </table>

    <form method="post">
        <button type="submit" name="clear">Clear Results</button>
    </form>

    <a href="index.php">Back to Calculator</a>
</div>

</body>
</html>
