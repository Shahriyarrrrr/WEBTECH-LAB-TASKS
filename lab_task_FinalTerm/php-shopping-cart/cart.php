<?php
session_start();

if (isset($_POST["update"])) {
    foreach ($_POST["qty"] as $id=>$q) {
        if ($q <= 0) {
            unset($_SESSION["cart"][$id]);
        } else {
            $_SESSION["cart"][$id]["quantity"] = $q;
        }
    }
}

if (isset($_POST["empty"])) {
    unset($_SESSION["cart"]);
}

$cart = $_SESSION["cart"] ?? [];
$total = 0;
$count = 0;
foreach ($cart as $i) {
    $count += $i["quantity"];
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Cart</title>
    <style>
        body{font-family:Arial;background:#f2f2f2}
        .box{width:90%;margin:30px auto;background:#fff;padding:20px}
        table{width:100%;border-collapse:collapse}
        th,td{border:1px solid #000;padding:8px;text-align:center}
        button,a{margin-top:10px;display:inline-block}
    </style>
</head>
<body>

<div class="box">
<h3>Your Cart (<?php echo $count; ?> items)</h3>

<form method="post">
<table>
<tr>
    <th>Name</th>
    <th>Price</th>
    <th>Qty</th>
    <th>Subtotal</th>
</tr>
<?php foreach ($cart as $id=>$i) {
    $sub = $i["price"] * $i["quantity"];
    $total += $sub;
?>
<tr>
    <td><?php echo $i["product_name"]; ?></td>
    <td><?php echo $i["price"]; ?></td>
    <td><input type="number" name="qty[<?php echo $id; ?>]" value="<?php echo $i["quantity"]; ?>"></td>
    <td><?php echo $sub; ?></td>
</tr>
<?php } ?>
<tr>
    <td colspan="3">Grand Total</td>
    <td><?php echo $total; ?></td>
</tr>
</table>

<button name="update">Update Cart</button>
<button name="empty">Empty Cart</button>
</form>

<br>
<a href="products.php">Continue Shopping</a>
</div>

</body>
</html>
