<?php
session_start();

$products = [
    1 => ["name"=>"Laptop","price"=>800,"image"=>"https://via.placeholder.com/150"],
    2 => ["name"=>"Mouse","price"=>20,"image"=>"https://via.placeholder.com/150"],
    3 => ["name"=>"Keyboard","price"=>40,"image"=>"https://via.placeholder.com/150"],
    4 => ["name"=>"Headphones","price"=>60,"image"=>"https://via.placeholder.com/150"],
    5 => ["name"=>"Monitor","price"=>200,"image"=>"https://via.placeholder.com/150"]
];

if (isset($_POST["add"])) {
    $id = (int)$_POST["id"];
    if (!isset($_SESSION["cart"][$id])) {
        $_SESSION["cart"][$id] = [
            "product_id"=>$id,
            "product_name"=>$products[$id]["name"],
            "price"=>$products[$id]["price"],
            "quantity"=>1
        ];
    } else {
        $_SESSION["cart"][$id]["quantity"]++;
    }
}

$count = 0;
if (isset($_SESSION["cart"])) {
    foreach ($_SESSION["cart"] as $i) {
        $count += $i["quantity"];
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Products</title>
    <style>
        body{font-family:Arial;background:#f2f2f2}
        .top{width:90%;margin:20px auto;display:flex;justify-content:space-between}
        .grid{width:90%;margin:auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:15px}
        .card{background:#fff;padding:15px;text-align:center}
        img{width:150px;height:150px}
        button{margin-top:10px}
    </style>
</head>
<body>

<div class="top">
    <h3>Products</h3>
    <a href="cart.php">Cart (<?php echo $count; ?>)</a>
</div>

<div class="grid">
<?php foreach ($products as $id=>$p) { ?>
<div class="card">
    <img src="<?php echo $p["image"]; ?>">
    <h4><?php echo $p["name"]; ?></h4>
    <p>$<?php echo $p["price"]; ?></p>
    <form method="post">
        <input type="hidden" name="id" value="<?php echo $id; ?>">
        <button name="add">Add to Cart</button>
    </form>
</div>
<?php } ?>
</div>

</body>
</html>
