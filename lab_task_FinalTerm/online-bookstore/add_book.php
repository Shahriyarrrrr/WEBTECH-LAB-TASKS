<?php
require "db.php";
$msg = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $title = $_POST["title"];
    $author = $_POST["author"];
    $isbn = $_POST["isbn"];
    $price = $_POST["price"];
    $category = $_POST["category"];
    $stock = $_POST["stock"];
    $year = $_POST["year"];

    if ($price <= 0) {
        $msg = "Price must be positive";
    } else {
        $q = $conn->prepare("SELECT book_id FROM books WHERE isbn=?");
        $q->bind_param("s", $isbn);
        $q->execute();
        $q->store_result();

        if ($q->num_rows > 0) {
            $msg = "Duplicate ISBN";
        } else {
            $s = $conn->prepare("INSERT INTO books (title,author,isbn,price,category,stock_quantity,publication_year) VALUES (?,?,?,?,?,?,?)");
            $s->bind_param("sssdsii", $title, $author, $isbn, $price, $category, $stock, $year);
            $s->execute();
            $msg = "Book added successfully";
        }
    }
}
?>

<!DOCTYPE html>
<html>
<body>

<h2>Add Book</h2>

<form method="post">
<input name="title" placeholder="Title"><br><br>
<input name="author" placeholder="Author"><br><br>
<input name="isbn" placeholder="ISBN"><br><br>
<input name="price" type="number" step="0.01" placeholder="Price"><br><br>
<input name="category" placeholder="Category"><br><br>
<input name="stock" type="number" placeholder="Stock Quantity"><br><br>
<input name="year" type="number" placeholder="Publication Year"><br><br>
<button>Add Book</button>
</form>

<p><?php echo $msg; ?></p>

<a href="catalog.php">View Catalog</a>

</body>
</html>
