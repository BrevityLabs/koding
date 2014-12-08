<?php
/* @var $this SaleController */

$this->pageTitle=Yii::app()->name;
$this->renderPartial('_search', array('model'=>$model)); 

// if($resultset != null){
// 	$jsonData = CJSON::encode($resultset);
?>
<hr style="width:900px"/>
<table style="width:900px;">
	<tr><td style="width:600px">
		<input type="checkbox" name="labelO"> County Names</div><br/>
		<input type="button" name="inc" value="+"><input type="button" name="dec" value="-">
	</td></tr>
</table>
<script type="text/javascript">
<!--
	drawMap('<?php echo  Yii::app()->baseUrl?>', true);
//-->
</script>
<div class="map" style="display:block"></div>
