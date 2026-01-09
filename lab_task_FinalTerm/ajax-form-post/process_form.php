<?php
$name=$_POST["name"]??"";
$email=$_POST["email"]??"";

if($name===""||!filter_var($email,FILTER_VALIDATE_EMAIL)){
    echo "Validation failed";
}else{
    echo "Form submitted successfully";
}
