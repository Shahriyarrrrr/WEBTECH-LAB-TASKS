<?php
require "db.php";

$term = $_GET["term"] ?? "";
$cat = $_GET["category"] ?? "";
$min = $_GET["min"] ?? 0;
$max = $_GET["max"] ?? 100000;

$q = $conn->prepare(
"SELECT book_id,title,author,price FROM books
 WHERE (title LIKE ? OR author LIKE ?)
 AND category LIKE ?
 AND price BETWEEN ? AND ?"
);

$like = "%$term%";
$catLike = "%$cat%";
$q->bind_param("sssdd", $like, $like, $catLike, $min, $max);
$q->execute();
$res = $q->get_result();
?>

<!DOCTYPE html>
<html>
<body>

<h2>Search Books</h2>

<form method="get">
<input name="term" placeholder="Title or Author">
<input name="category" placeholder="Category">
<input name="min" type="number" placeholder="Min Price">
<input name="max" type="number" placeholder="Max Price">
<button>Search</button>
</form>

<?php while ($b = $res->fetch_assoc()) { ?>
<p>
<?php echo $b["title"]; ?> -
<?php echo $b["author"]; ?> -
$<?php echo $b["price"]; ?>
<a href="details.php?id=<?php echo $b["book_id"]; ?>">View</a>
</p>
<?php } ?>

<a href="catalog.php">Back to Catalog</a>

</body>
</html>
