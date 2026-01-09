<?php
$questions = [
    1 => [
        "q" => "What does HTML stand for?",
        "o" => ["Hyper Text Markup Language","High Text Machine Language","Hyperlink Text Markup Language","Home Tool Markup Language"],
        "a" => 0
    ],
    2 => [
        "q" => "Which language is used for server-side scripting?",
        "o" => ["HTML","CSS","PHP","JavaScript"],
        "a" => 2
    ],
    3 => [
        "q" => "Which protocol is used to transfer web pages?",
        "o" => ["FTP","SMTP","HTTP","TCP"],
        "a" => 2
    ],
    4 => [
        "q" => "Which tag is used to link CSS?",
        "o" => ["<script>","<style>","<css>","<link>"],
        "a" => 3
    ],
    5 => [
        "q" => "Which method is used to send form data securely?",
        "o" => ["GET","POST","REQUEST","FETCH"],
        "a" => 1
    ]
];

$answers = [];
$score = 0;
$submitted = false;
$feedback = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $submitted = true;
    $answers = $_POST["q"] ?? [];

    foreach ($questions as $id => $q) {
        if (isset($answers[$id]) && $answers[$id] == $q["a"]) {
            $score++;
        }
    }

    $percentage = ($score / count($questions)) * 100;

    switch (true) {
        case $percentage >= 80:
            $feedback = "Excellent";
            break;
        case $percentage >= 60:
            $feedback = "Good";
            break;
        case $percentage >= 40:
            $feedback = "Average";
            break;
        default:
            $feedback = "Poor";
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Online Quiz</title>
    <style>
        body { font-family: Arial; background:#f2f2f2; }
        .box { width:700px; margin:40px auto; background:#fff; padding:20px; }
        .question { margin-bottom:15px; }
        .correct { color:green; }
        .wrong { color:red; }
        button { padding:10px; margin-top:15px; }
    </style>
</head>
<body>

<div class="box">
<form method="post">
<?php foreach ($questions as $id => $q) { ?>
<div class="question">
    <strong><?php echo $id . ". " . $q["q"]; ?></strong><br>
    <?php foreach ($q["o"] as $k => $opt) { ?>
        <input type="radio" name="q[<?php echo $id; ?>]" value="<?php echo $k; ?>"
        <?php if (isset($answers[$id]) && $answers[$id] == $k) echo "checked"; ?>>
        <?php echo $opt; ?><br>
    <?php } ?>
</div>
<?php } ?>
<button type="submit">Submit Quiz</button>
</form>

<?php if ($submitted) { ?>
<hr>
<h3>Score: <?php echo $score . " / " . count($questions); ?></h3>
<h3>Percentage: <?php echo $percentage; ?>%</h3>
<h3>Feedback: <?php echo $feedback; ?></h3>

<?php foreach ($questions as $id => $q) {
    if (isset($answers[$id]) && $answers[$id] == $q["a"]) {
        echo "<p class='correct'>Question $id: Correct</p>";
    } else {
        echo "<p class='wrong'>Question $id: Incorrect</p>";
    }
} ?>
<?php } ?>
</div>

</body>
</html>
