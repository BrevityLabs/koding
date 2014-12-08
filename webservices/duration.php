<?php
//Web-service returns the date range in the data sample.
$aggregate	= isset($_REQUEST['aggregate'])?$_GET['aggregate']: "count";
$period		= isset($_REQUEST['pmonth'])?$_GET['pmonth']:0;
$period1	= isset($_REQUEST['pmonth1'])?$_GET['pmonth1']:0;
$period2	= isset($_REQUEST['pmonth2'])?$_GET['pmonth2']:0;

include 'inc_lc.php';

if($aggregate == "count"){
	$selectFields = "a.county, avg(b.lat) as lat, avg(b.lng) as lng, count(*) as count";
	$orderby = "group by 1";
} elseif($aggregate == "average")
	$selectFields = "a.price, b.lat, b.lng, avg(a.price) as count";
elseif($aggregate == "count")
	$selectFields = "a.price, b.lat, b.lng count(*) as count";
elseif($aggregate == "count")
	$selectFields = "a.price, b.lat, b.lng count(*) as count";
else
	$selectFields = null;

if($period != 0)
	$whereclause = "where dateofsale like '$period%'";
else
	$whereclause = "where dateofsale >= '$period1' and dateofsale <= '$period2-31'"; //its a string so there won't be an exception

$queryString = "select $selectFields from housesale a join ukpostcode b " 
		. "on left(a.postcode, 4) = b.outcode $whereclause $orderby";
//echo $queryString;
$result = $conn->query($queryString);
//echo $result->num_rows;
$mydata = array();
while($row = $result->fetch_assoc()) {
	$arecord = array();
	$arecord["county"]  = $row["county"];
	$arecord["lat"]   	= $row["lat"];
	$arecord["lng"]   	= $row["lng"];
	$arecord["count"] 	= $row["count"];
	array_push($mydata, $arecord);
}
$jsondata = json_encode($mydata);
$conn->close();
echo $jsondata;

?>
