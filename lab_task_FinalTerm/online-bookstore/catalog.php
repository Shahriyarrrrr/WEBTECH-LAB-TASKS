<?php
require "db.php";

$page = $_GET["page"] ?? 1;
$limit = 10;
$offset = ($page - 1) * $limit;

$r = $conn->prepare("SELECT book_id,title,author,price,stock_quantity FROM books LIMIT ? OFFSET ?");
$r->bind_param("ii", $limit, $offset);
$r->execute();
$res = $r->get_result();
?>

<!DOCTYPE html>
<html>
<body>

<h2>Book Catalog</h2>

<?php while ($b = $res->fetch_assoc()) { ?>
<div>
<img src="https://via.placeholder.com/100">
<h3><?php echo $b["title"]; ?></h3>
<p><?php echo $b["author"]; ?></p>
<p>$<?php echo $b["price"]; ?></p>
<p><?php echo $b["stock_quantity"] > 0 ? "In Stock" : "Out of Stock"; ?></p>
<a href="details.php?id=<?php echo $b["book_id"]; ?>">View Details</a>
</div>
<hr>
<?php } ?>

<a href="catalog.php?page=<?php echo $page+1; ?>">Next Page</a><br>
<a href="search.php">Search Books</a>

</body>
</html>
