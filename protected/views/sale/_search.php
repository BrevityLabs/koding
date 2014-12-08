<?php
/* @var $this SaleController */
/* @var $model Sale */
/* @var $form CActiveForm */
?>

<div class="wide form">

<?php $form=$this->beginWidget('CActiveForm', array(
	'id'=>'sale-form',
	'action'=>Yii::app()->createUrl($this->route),
	'method'=>'get',
)); ?>
	
	<table style="width:900px">
		<tr>
			<td><div class="row">
					<?php echo $form->label($model,'price'); ?>
					<?php echo $form->dropDownList($model,'price',Sale::model()->priceRange()); ?>
				</div>
			
				<div class="row">
					<?php echo $form->label($model,'soldbetwn'); ?>
					<?php echo $form->dropDownList($model,'soldonLow',  Sale::model()->periodRange());?>
					<?php echo $form->dropDownList($model,'soldonHigh', Sale::model()->periodRange());?>
				</div>
			
				<div class="row">
					<?php echo $form->label($model,'pcode'); ?>
					<?php //echo $form->textField($model,'pcode',array('size'=>10,'maxlength'=>10)); ?>
					<?php 
						$this->widget('zii.widgets.jui.CJuiAutoComplete',array(
							'model'=>$model,
						    'name'=>'pcode',
						    'sourceUrl'=>$this->createUrl('sale/postcode'),
						    'options'=>array('minLength'=>'2'),
							'htmlOptions'=>array('style'=>'width:122px'),
						));
					?>
				</div></td>
			<td><div class="row">
					<?php echo $form->label($model,'ptype'); ?>
					<?php echo $form->dropDownList($model,'ptype',array('0'=>'Does not matter', 'D'=>'Detached','S'=>'Semi-Detached','T'=>'Terraced','F'=>'Flat')); ?>
				</div>
				<div class="row">
					<?php echo $form->label($model,'isnew'); ?>
					<?php echo $form->dropDownList($model,'isnew',array('0'=>'Does not matter','Y'=>'New','N'=>'Old')); ?>
				</div>
			
				<div class="row">
					<?php echo $form->label($model,'lease'); ?>
					<?php echo $form->dropDownList($model,'lease',array('0'=>'Does not matter','L'=>'Leased','F'=>'Freehold')); ?>
				</div></td>
			<td>
				<div class="row">
					<?php echo $form->label($model,'city'); ?>
					<?php echo $form->textField($model,'city',array('size'=>18,'maxlength'=>36)); ?>
				</div>
				<div class="row">
					<?php echo $form->label($model,'county'); ?>
					<?php echo $form->textField($model,'county',array('size'=>18,'maxlength'=>36)); ?>
				</div>
				<div class="row">
					<?php echo $form->label($model,'aggregateType'); ?>
					<?php echo $form->dropDownList($model,'aggregateType',array('count'=>'Count','average'=>'Average','maximum'=>'Highest')); ?>
				</div>
			</td>
		</tr>
	</table>
	
<?php $this->endWidget(); ?>

</div><!-- search-form -->