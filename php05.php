<?php
// ======================================
// Lab Task 5: PHP Classes and Objects (OOP)
// ======================================

// 1. Create a Book class
class Book {
    private $title;
    private $author;
    private $year;

    // 2. Constructor to initialize values
    public function __construct($title, $author, $year) {
        $this->title  = $title;
        $this->author = $author;
        $this->year   = $year;
    }

    // Method to return details about the book
    public function getDetails() {
        return "Title: {$this->title}, Author: {$this->author}, Year: {$this->year}";
    }

    // Setter methods to update properties
    public function setTitle($title) {
        $this->title = $title;
    }

    public function setAuthor($author) {
        $this->author = $author;
    }

    public function setYear($year) {
        $this->year = $year;
    }
}


// 3. Create an object and test the class
$book1 = new Book("The Alchemist", "Paulo Coelho", 1988);

// Display initial details
echo "<h3>Book Details (Initial):</h3>";
echo $book1->getDetails() . "<br><br>";

// Update properties using setters
$book1->setTitle("Harry Potter and the Sorcerer's Stone");
$book1->setAuthor("J.K. Rowling");
$book1->setYear(1997);

// Display updated details
echo "<h3>Book Details (After Update):</h3>";
echo $book1->getDetails();
?>
