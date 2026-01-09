<?php
session_start();

$products = [
    ["id"=>1,"name"=>"Laptop","price"=>800],
    ["id"=>2,"name"=>"Mouse","price"=>20],
    ["id"=>3,"name"=>"Keyboard","price"=>40],
    ["id"=>4,"name"=>"Headphone","price"=>60],
    ["id"=>5,"name"=>"Monitor","price"=>200]
];

if (isset($_POST["add"])) {
    $id = $_POST["id"];
    if (!isset($_SESSION["cart"][$id])) {
        $_SESSION["cart"][$id] = 1;
    } else {
        $_SESSION["cart"][$id]++;
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Product Catalog</title>
    <style>
        body { font-family: Arial; background:#f2f2f2; }
        .box { width:600px; margin:40px auto; background:#fff; padding:20px; }
        .product { border-bottom:1px solid #ccc; padding:10px; }
        button { margin-top:5px; }
        a { display:block; margin-top:15px; text-align:center; }
    </style>
</head>
<body>

<div class="box">
    <?php foreach ($products as $p) { ?>
        <div class="product">
            <strong><?php echo $p["name"]; ?></strong><br>
            Price: $<?php echo $p["price"]; ?>
            <form method="post">
                <input type="hidden" name="id" value="<?php echo $p["id"]; ?>">
                <button type="submit" name="add">Add to Cart</button>
            </form>
        </div>
    <?php } ?>
    <a href="cart.php">View Cart</a>
</div>

</body>
</html>
