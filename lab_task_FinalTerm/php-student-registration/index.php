<?php
$errors = [];
$success = false;

$name = $_POST["name"] ?? "";
$email = $_POST["email"] ?? "";
$username = $_POST["username"] ?? "";
$age = $_POST["age"] ?? "";
$gender = $_POST["gender"] ?? "";
$course = $_POST["course"] ?? "";
$terms = isset($_POST["terms"]);

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if ($name === "" || $email === "" || $username === "" || $_POST["password"] === "" || $_POST["confirm"] === "" || $age === "" || $gender === "" || $course === "") {
        $errors[] = "All fields must be filled";
    }

    if (!preg_match("/^[a-zA-Z ]+$/", $name)) {
        $errors[] = "Full Name must contain only letters and spaces";
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Invalid email format";
    }

    if (strlen($username) < 5) {
        $errors[] = "Username must be at least 5 characters long";
    }

    if (strlen($_POST["password"]) < 6) {
        $errors[] = "Password must be at least 6 characters long";
    }

    if ($_POST["password"] !== $_POST["confirm"]) {
        $errors[] = "Passwords do not match";
    }

    if ($age < 18) {
        $errors[] = "Age must be 18 or above";
    }

    if (!$terms) {
        $errors[] = "You must accept Terms & Conditions";
    }

    if (empty($errors)) {
        $success = true;
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Student Registration</title>
</head>
<body>

<form method="post">
    <label>Full Name:</label><br>
    <input type="text" name="name" value="<?php echo $name; ?>"><br><br>

    <label>Email Address:</label><br>
    <input type="email" name="email" value="<?php echo $email; ?>"><br><br>

    <label>Username:</label><br>
    <input type="text" name="username" value="<?php echo $username; ?>"><br><br>

    <label>Password:</label><br>
    <input type="password" name="password"><br><br>

    <label>Confirm Password:</label><br>
    <input type="password" name="confirm"><br><br>

    <label>Age:</label><br>
    <input type="number" name="age" value="<?php echo $age; ?>"><br><br>

    <label>Gender:</label><br>
    <input type="radio" name="gender" value="Male" <?php if ($gender=="Male") echo "checked"; ?>> Male
    <input type="radio" name="gender" value="Female" <?php if ($gender=="Female") echo "checked"; ?>> Female<br><br>

    <label>Course:</label><br>
    <select name="course">
        <option value="">Select Course</option>
        <option value="CSE" <?php if ($course=="CSE") echo "selected"; ?>>CSE</option>
        <option value="EEE" <?php if ($course=="EEE") echo "selected"; ?>>EEE</option>
        <option value="BBA" <?php if ($course=="BBA") echo "selected"; ?>>BBA</option>
    </select><br><br>

    <input type="checkbox" name="terms" <?php if ($terms) echo "checked"; ?>> I accept Terms & Conditions<br><br>

    <button type="submit">Register</button>
</form>

<?php
if (!empty($errors)) {
    echo "<h3>Errors</h3>";
    foreach ($errors as $e) {
        echo $e . "<br>";
    }
}

if ($success) {
    echo "<h2>Registration Successful!</h2>";
    echo "Name: $name<br>";
    echo "Email: $email<br>";
    echo "Username: $username<br>";
    echo "Age: $age<br>";
    echo "Gender: $gender<br>";
    echo "Course: $course<br>";
}
?>

</body>
</html>
