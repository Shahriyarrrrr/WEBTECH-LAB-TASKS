<?php
$name = "";
$email = "";
$password = "";
$confirmPassword = "";
$errors = [];

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if (empty($_POST["name"]) || empty($_POST["email"]) || empty($_POST["password"]) || empty($_POST["confirm_password"])) {
        $errors[] = "All fields are required";
    }

    if (!filter_var($_POST["email"], FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Invalid email format";
    }

    if ($_POST["password"] !== $_POST["confirm_password"]) {
        $errors[] = "Passwords do not match";
    }

    if (empty($errors)) {
        $name = htmlspecialchars(trim($_POST["name"]));
        $email = htmlspecialchars(trim($_POST["email"]));
        $password = htmlspecialchars(trim($_POST["password"]));
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>User Registration</title>
    <style>
        body {
            font-family: Arial;
            background-color: #f2f2f2;
        }
        .container {
            width: 400px;
            margin: 50px auto;
            background: #fff;
            padding: 20px;
            border-radius: 5px;
        }
        input {
            width: 100%;
            padding: 8px;
            margin-top: 8px;
        }
        .error {
            color: red;
            margin-bottom: 10px;
        }
        .success {
            color: green;
        }
        button {
            margin-top: 15px;
            padding: 10px;
            width: 100%;
        }
    </style>
</head>
<body>

<div class="container">
    <?php
    if (!empty($errors)) {
        foreach ($errors as $error) {
            echo "<div class='error'>$error</div>";
        }
    }

    if ($_SERVER["REQUEST_METHOD"] === "POST" && empty($errors)) {
        echo "<div class='success'>";
        echo "Registration Successful<br>";
        echo "Name: $name<br>";
        echo "Email: $email<br>";
        echo "</div>";
    }
    ?>

    <form method="post" action="">
        <input type="text" name="name" placeholder="Name" value="<?php echo $name; ?>">
        <input type="email" name="email" placeholder="Email" value="<?php echo $email; ?>">
        <input type="password" name="password" placeholder="Password">
        <input type="password" name="confirm_password" placeholder="Confirm Password">
        <button type="submit">Register</button>
    </form>
</div>

</body>
</html>
