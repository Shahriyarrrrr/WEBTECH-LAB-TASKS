<?php
$student=[
    "id"=>1,
    "name"=>"John Doe",
    "email"=>"john@example.com",
    "department"=>"CSE"
];

header("Content-Type: application/json");
echo json_encode($student);
