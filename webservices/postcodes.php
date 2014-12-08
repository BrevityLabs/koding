<?php
//Web-service returns the date range in the data sample.
$startswith = isset($_REQUEST['term'])?$_GET['term']:0;
include 'inc_lc.php';

$queryString = "select DISTINCT(SUBSTR(postcode,1,INSTR(postcode,' ')-1)) as postcode from housesale where postcode like '"
		. $startswith . "%'";
$result = $conn->query($queryString);

$mydata = array();
while($row = $result->fetch_assoc()) {
	array_push($mydata, $row["postcode"]);
}
$jsondata = json_encode($mydata);
$conn->close();
echo $jsondata;
?>