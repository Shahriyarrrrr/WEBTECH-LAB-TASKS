<?php
require "db.php";

$id = $_GET["id"];

$q = $conn->prepare("SELECT * FROM books WHERE book_id=?");
$q->bind_param("i", $id);
$q->execute();
$book = $q->get_result()->fetch_assoc();

$r = $conn->prepare("SELECT book_id,title FROM books WHERE category=? AND book_id!=?");
$r->bind_param("si", $book["category"], $id);
$r->execute();
$related = $r->get_result();
?>

<!DOCTYPE html>
<html>
<body>

<h2><?php echo $book["title"]; ?></h2>
<p>Author: <?php echo $book["author"]; ?></p>
<p>ISBN: <?php echo $book["isbn"]; ?></p>
<p>Price: $<?php echo $book["price"]; ?></p>
<p>Category: <?php echo $book["category"]; ?></p>
<p>Year: <?php echo $book["publication_year"]; ?></p>
<p>Stock: <?php echo $book["stock_quantity"]; ?></p>

<h3>Related Books</h3>
<?php while ($r = $related->fetch_assoc()) { ?>
<p>
<a href="details.php?id=<?php echo $r["book_id"]; ?>">
<?php echo $r["title"]; ?>
</a>
</p>
<?php } ?>

<a href="catalog.php">Back</a>

</body>
</html>
