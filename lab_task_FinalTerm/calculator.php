<?php
$result = "";
$error = "";
$num1 = "";
$num2 = "";
$operation = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $num1 = $_POST["num1"];
    $num2 = $_POST["num2"];
    $operation = $_POST["operation"];

    if (!is_numeric($num1) || !is_numeric($num2)) {
        $error = "Please enter valid numbers";
    } else {
        switch ($operation) {
            case "+":
                $result = $num1 + $num2;
                break;
            case "-":
                $result = $num1 - $num2;
                break;
            case "*":
                $result = $num1 * $num2;
                break;
            case "/":
                if ($num2 == 0) {
                    $error = "Division by zero is not allowed";
                } else {
                    $result = $num1 / $num2;
                }
                break;
        }
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Simple Calculator</title>
    <style>
        body {
            background-color: #f0f0f0;
            font-family: Arial;
        }
        .calculator {
            width: 300px;
            margin: 80px auto;
            background: #222;
            padding: 20px;
            border-radius: 10px;
            color: #fff;
        }
        input, select, button {
            width: 100%;
            margin-top: 10px;
            padding: 10px;
            font-size: 16px;
        }
        button {
            background: #4CAF50;
            color: white;
            border: none;
        }
        .result {
            margin-top: 15px;
            font-size: 18px;
            text-align: center;
        }
        .error {
            margin-top: 15px;
            color: red;
            text-align: center;
        }
    </style>
</head>
<body>

<div class="calculator">
    <form method="post">
        <input type="text" name="num1" placeholder="First Number" value="<?php echo $num1; ?>">
        <input type="text" name="num2" placeholder="Second Number" value="<?php echo $num2; ?>">
        <select name="operation">
            <option value="+">+</option>
            <option value="-">-</option>
            <option value="*">×</option>
            <option value="/">÷</option>
        </select>
        <button type="submit">Calculate</button>
    </form>

    <?php
    if ($result !== "" && $error === "") {
        echo "<div class='result'>Result: $result</div>";
    }
    if ($error !== "") {
        echo "<div class='error'>$error</div>";
    }
    ?>
</div>

</body>
</html>
