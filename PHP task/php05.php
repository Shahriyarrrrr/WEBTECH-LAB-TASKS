<?php
class Book {
    private $title;
    private $author;
    private $year;

    public function __construct($title, $author, $year) {
        $this->title = $title;
        $this->author = $author;
        $this->year = $year;
    }

    public function getDetails() {
        return "Title: {$this->title}, Author: {$this->author}, Year: {$this->year}";
    }

    public function setTitle($title) { $this->title = $title; }
    public function setAuthor($author) { $this->author = $author; }
    public function setYear($year) { $this->year = $year; }
}

$book1 = new Book("The Alchemist", "Paulo Coelho", 1988);
echo "<h3>Initial Book Info:</h3>";
echo $book1->getDetails() . "<br><br>";

$book1->setTitle("Harry Potter and the Sorcerer's Stone");
$book1->setAuthor("J.K. Rowling");
$book1->setYear(1997);

echo "<h3>Updated Book Info:</h3>";
echo $book1->getDetails();
?>
