<?php
$users=["john","alice","bob","mike","sara","admin","test","user123","demo","guest"];

$name=strtolower($_GET["username"] ?? "");
$exists=in_array($name,array_map("strtolower",$users));

header("Content-Type: application/json");

if($exists){
    echo json_encode(["available"=>false,"message"=>"Username is taken"]);
}else{
    echo json_encode(["available"=>true,"message"=>"Username is available"]);
}
