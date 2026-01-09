<?php
$name = "";
$email = "";
$subject = "";
$message = "";
$errors = [];
$success = false;

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if (empty($_POST["name"]) || empty($_POST["email"]) || empty($_POST["subject"]) || empty($_POST["message"])) {
        $errors[] = "All required fields must be filled";
    }

    if (!filter_var($_POST["email"], FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Invalid email format";
    }

    if (strlen($_POST["message"]) < 10) {
        $errors[] = "Message must be at least 10 characters long";
    }

    if (isset($_FILES["attachment"]) && $_FILES["attachment"]["name"] !== "") {
        $allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
        if (!in_array($_FILES["attachment"]["type"], $allowedTypes)) {
            $errors[] = "Invalid file type";
        }
        if ($_FILES["attachment"]["size"] > 2097152) {
            $errors[] = "File size must be less than 2MB";
        }
    }

    if (empty($errors)) {
        $name = htmlspecialchars(trim($_POST["name"]));
        $email = htmlspecialchars(trim($_POST["email"]));
        $subject = htmlspecialchars(trim($_POST["subject"]));
        $message = htmlspecialchars(trim($_POST["message"]));
        $success = true;
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Contact Form</title>
    <style>
        body {
            font-family: Arial;
            background-color: #f4f4f4;
        }
        .container {
            width: 450px;
            margin: 40px auto;
            background: #fff;
            padding: 20px;
            border-radius: 5px;
        }
        input, select, textarea, button {
            width: 100%;
            padding: 8px;
            margin-top: 10px;
        }
        textarea {
            resize: none;
        }
        .error {
            color: red;
            margin-bottom: 10px;
        }
        .success {
            color: green;
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

    if ($success) {
        echo "<div class='success'>Email sent successfully</div>";
        echo "<p>Name: $name</p>";
        echo "<p>Email: $email</p>";
        echo "<p>Subject: $subject</p>";
        echo "<p>Message: $message</p>";
    } else {
    ?>
    <form method="post" enctype="multipart/form-data">
        <input type="text" name="name" placeholder="Name" value="<?php echo $name; ?>" required>
        <input type="email" name="email" placeholder="Email" value="<?php echo $email; ?>" required>
        <select name="subject" required>
            <option value="">Select Subject</option>
            <option value="General">General</option>
            <option value="Support">Support</option>
            <option value="Feedback">Feedback</option>
        </select>
        <textarea name="message" rows="5" placeholder="Message" required><?php echo $message; ?></textarea>
        <input type="file" name="attachment">
        <button type="submit">Send</button>
    </form>
    <?php } ?>
</div>

</body>
</html>
