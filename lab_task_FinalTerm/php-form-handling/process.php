<?php
$errors = [];

$name = $_POST["name"] ?? "";
$email = $_POST["email"] ?? "";
$age = $_POST["age"] ?? "";
$gender = $_POST["gender"] ?? "";
$skills = $_POST["skills"] ?? [];
$country = $_POST["country"] ?? "";

if ($name === "") {
    $errors[] = "Name is required";
}

if ($email === "") {
    $errors[] = "Email is required";
}

if ($age === "" || $age <= 0) {
    $errors[] = "Age must be a positive number";
}

if ($gender === "") {
    $errors[] = "Gender must be selected";
}

if (count($skills) === 0) {
    $errors[] = "At least one skill must be selected";
}

echo "<h2>Request Information</h2>";
echo "Request Method: " . $_SERVER["REQUEST_METHOD"] . "<br>";
echo "Script Name: " . $_SERVER["SCRIPT_NAME"] . "<br><br>";

if (!empty($errors)) {
    echo "<h3>Errors</h3>";
    foreach ($errors as $e) {
        echo $e . "<br>";
    }
} else {
    echo "<h3>Form Submitted Successfully</h3>";
    echo "Name: $name<br>";
    echo "Email: $email<br>";
    echo "Age: $age<br>";
    echo "Gender: $gender<br>";
    echo "Country: $country<br>";
    echo "Skills:<br>";
    foreach ($skills as $s) {
        echo "- $s<br>";
    }
}
?>
