<?php 
//Web-service returns the lat-long values for the sales made in UK.
$tick = isset($_REQUEST['tick'])?$_GET['tick']:0;
include 'inc_lc.php';

$dataRange = "limit ". 10 * $tick . ", 100"; 

$queryString = "select a.price, b.lat, b.lng from housesale a join ukpostcode b " 
		. "on left(a.postcode, 4) = b.outcode " . $dataRange;
$result = $conn->query($queryString);
$mydata = array();
while($row = $result->fetch_assoc()) {
	$arecord = array();
	$arecord["lat"]   = $row["lat"];
	$arecord["lng"]   = $row["lng"];
	$arecord["price"] = $row["price"];
	array_push($mydata, $arecord);
}
$jsondata = json_encode($mydata);
$conn->close();
echo $jsondata;

?>
