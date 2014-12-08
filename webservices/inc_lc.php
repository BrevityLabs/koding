<?php 
$servername = "localhost";
$username = "root"; //"tallyho_topojso";
$password = ""; // "8{XK_9DoWTKU";

// Create connection
$conn = new mysqli($servername, $username, $password, "ukprop");

// Check connection
if ($conn->connect_error) {
	die("Connection failed: " . $conn->connect_error);
}
?>