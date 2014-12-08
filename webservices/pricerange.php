<?php
//Web-service returns the date range in the data sample.
include 'inc_lc.php';

$queryString = "select MIN(price) as lowest, MAX(price) as highest from housesale";
$result = $conn->query($queryString);

if($row = $result->fetch_assoc()) {
	$arecord = array();
	$arecord["min"]   = $row["lowest"];
	$arecord["max"]   = $row["highest"];
}
$jsondata = json_encode($arecord);
$conn->close();
echo $jsondata;
?>