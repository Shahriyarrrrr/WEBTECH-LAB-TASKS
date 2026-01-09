<?php
session_start();

$products = [
    1=>["name"=>"Laptop","price"=>800],
    2=>["name"=>"Mouse","price"=>20],
    3=>["name"=>"Keyboard","price"=>40],
    4=>["name"=>"Headphone","price"=>60],
    5=>["name"=>"Monitor","price"=>200]
];

$cart = $_SESSION["cart"] ?? [];
$total = 0;
$placed = false;

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $placed = true;
    session_destroy();
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Checkout</title>
    <style>
        body { font-family: Arial; background:#f2f2f2; }
        .box { width:500px; margin:40px auto; background:#fff; padding:20px; }
        input,button { width:100%; padding:8px; margin-top:10px; }
    </style>
</head>
<body>

<div class="box">
<?php if ($placed) { ?>
    <h3>Order Placed Successfully</h3>
<?php } else { ?>
    <h3>Order Summary</h3>
    <?php foreach ($cart as $id=>$qty) {
        $line = $products[$id]["price"] * $qty;
        $total += $line;
        echo "<p>{$products[$id]["name"]} x $qty = $line</p>";
    } ?>
    <p><strong>Total: <?php echo $total; ?></strong></p>

    <form method="post">
        <input type="text" name="name" placeholder="Name" required>
        <input type="email" name="email" placeholder="Email" required>
        <button type="submit">Place Order</button>
    </form>
<?php } ?>
</div>

</body>
</html>
