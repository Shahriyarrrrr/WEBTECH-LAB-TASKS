<?php
session_start();

$products = [
    1=>["name"=>"Laptop","price"=>800],
    2=>["name"=>"Mouse","price"=>20],
    3=>["name"=>"Keyboard","price"=>40],
    4=>["name"=>"Headphone","price"=>60],
    5=>["name"=>"Monitor","price"=>200]
];

if (isset($_POST["update"])) {
    foreach ($_POST["qty"] as $id=>$q) {
        if ($q <= 0) {
            unset($_SESSION["cart"][$id]);
        } else {
            $_SESSION["cart"][$id] = $q;
        }
    }
}

$cart = $_SESSION["cart"] ?? [];
$total = 0;
?>

<!DOCTYPE html>
<html>
<head>
    <title>Cart</title>
    <style>
        body { font-family: Arial; background:#f2f2f2; }
        .box { width:600px; margin:40px auto; background:#fff; padding:20px; }
        table { width:100%; border-collapse:collapse; }
        th,td { border:1px solid #000; padding:8px; text-align:center; }
        button,a { margin-top:10px; display:inline-block; }
    </style>
</head>
<body>

<div class="box">
<form method="post">
<table>
<tr>
    <th>Product</th>
    <th>Price</th>
    <th>Qty</th>
    <th>Total</th>
</tr>
<?php foreach ($cart as $id=>$qty) {
    $p = $products[$id];
    $line = $p["price"] * $qty;
    $total += $line;
?>
<tr>
    <td><?php echo $p["name"]; ?></td>
    <td><?php echo $p["price"]; ?></td>
    <td><input type="number" name="qty[<?php echo $id; ?>]" value="<?php echo $qty; ?>"></td>
    <td><?php echo $line; ?></td>
</tr>
<?php } ?>
<tr>
    <td colspan="3">Grand Total</td>
    <td><?php echo $total; ?></td>
</tr>
</table>
<button type="submit" name="update">Update Cart</button>
</form>

<a href="checkout.php">Checkout</a>
<a href="index.php">Continue Shopping</a>
</div>

</body>
</html>
