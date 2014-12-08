<?php
/* @var $this SiteController */

$this->pageTitle=Yii::app()->name;
?>

<h1>Welcome to <i><?php echo CHtml::encode(Yii::app()->name); ?></i></h1>

<p> Explore UK Housing Analyses &amp; Visualizations.</p>

<?php $this->renderPartial('sale/index'); ?>
<div class="clear" style="height:400px"></div>
