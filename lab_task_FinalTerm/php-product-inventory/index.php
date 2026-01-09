<?php
$products = [
    ["name"=>"Laptop","price"=>800,"quantity"=>10,"category"=>"Electronics"],
    ["name"=>"Phone","price"=>600,"quantity"=>15,"category"=>"Electronics"],
    ["name"=>"Chair","price"=>120,"quantity"=>20,"category"=>"Furniture"],
    ["name"=>"Table","price"=>250,"quantity"=>8,"category"=>"Furniture"],
    ["name"=>"Headphone","price"=>90,"quantity"=>25,"category"=>"Accessories"]
];

$discounts = [
    "Electronics"=>10,
    "Furniture"=>15,
    "Accessories"=>5
];

function discountedPrice($price, $category, $discounts) {
    return $price - ($price * ($discounts[$category] / 100));
}

function mostExpensiveProduct($products) {
    $max = $products[0];
    foreach ($products as $p) {
        if ($p["price"] > $max["price"]) {
            $max = $p;
        }
    }
    return $max;
}

$totalValue = 0;
foreach ($products as $p) {
    $totalValue += $p["price"] * $p["quantity"];
}

$expensive = mostExpensiveProduct($products);
?>

<!DOCTYPE html>
<html>
<head>
    <title>Product Inventory</title>
    <style>
        body { font-family: Arial; background:#f2f2f2; }
        .box { width:800px; margin:40px auto; background:#fff; padding:20px; }
        table { width:100%; border-collapse:collapse; }
        th, td { border:1px solid #000; padding:8px; text-align:center; }
        h3 { margin-top:20px; }
    </style>
</head>
<body>

<div class="box">
<table>
<tr>
    <th>Name</th>
    <th>Category</th>
    <th>Price</th>
    <th>Quantity</th>
    <th>Discounted Price</th>
</tr>
<?php foreach ($products as $p) { ?>
<tr>
    <td><?php echo $p["name"]; ?></td>
    <td><?php echo $p["category"]; ?></td>
    <td><?php echo $p["price"]; ?></td>
    <td><?php echo $p["quantity"]; ?></td>
    <td><?php echo discountedPrice($p["price"], $p["category"], $discounts); ?></td>
</tr>
<?php } ?>
</table>

<h3>Total Inventory Value: <?php echo $totalValue; ?></h3>
<h3>Most Expensive Product: <?php echo $expensive["name"]; ?> (<?php echo $expensive["price"]; ?>)</h3>
</div>

</body>
</html>
