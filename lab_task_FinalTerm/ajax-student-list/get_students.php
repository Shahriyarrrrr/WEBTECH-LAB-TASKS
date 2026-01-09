<?php
$file = "students.json";

if (!file_exists($file) || filesize($file) == 0) {
    header("Content-Type: application/json");
    echo json_encode([]);
    exit;
}

$data = json_decode(file_get_contents($file), true);

header("Content-Type: application/json");
echo json_encode($data);
