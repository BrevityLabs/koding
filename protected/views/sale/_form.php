<?php
/* @var $this SaleController */
/* @var $model Sale */
/* @var $form CActiveForm */
?>

<div class="form">

<?php $form=$this->beginWidget('CActiveForm', array(
	'id'=>'sale-form',
	// Please note: When you enable ajax validation, make sure the corresponding
	// controller action is handling ajax validation correctly.
	// There is a call to performAjaxValidation() commented in generated controller code.
	// See class documentation of CActiveForm for details on this.
	'enableAjaxValidation'=>false,
)); ?>

	<p class="note">Fields with <span class="required">*</span> are required.</p>

	<?php echo $form->errorSummary($model); ?>

	<div class="row">
		<?php echo $form->labelEx($model,'id'); ?>
		<?php echo $form->textField($model,'id',array('size'=>40,'maxlength'=>40)); ?>
		<?php echo $form->error($model,'id'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'price'); ?>
		<?php echo $form->textField($model,'price',array('size'=>20,'maxlength'=>20)); ?>
		<?php echo $form->error($model,'price'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'soldon'); ?>
		<?php echo $form->textField($model,'soldon',array('size'=>20,'maxlength'=>20)); ?>
		<?php echo $form->error($model,'soldon'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'pcode'); ?>
		<?php echo $form->textField($model,'pcode',array('size'=>10,'maxlength'=>10)); ?>
		<?php echo $form->error($model,'pcode'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'ptype'); ?>
		<?php echo $form->textField($model,'ptype',array('size'=>1,'maxlength'=>1)); ?>
		<?php echo $form->error($model,'ptype'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'isnew'); ?>
		<?php echo $form->textField($model,'isnew',array('size'=>1,'maxlength'=>1)); ?>
		<?php echo $form->error($model,'isnew'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'lease'); ?>
		<?php echo $form->textField($model,'lease',array('size'=>1,'maxlength'=>1)); ?>
		<?php echo $form->error($model,'lease'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'paon'); ?>
		<?php echo $form->textField($model,'paon',array('size'=>36,'maxlength'=>36)); ?>
		<?php echo $form->error($model,'paon'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'saon'); ?>
		<?php echo $form->textField($model,'saon',array('size'=>36,'maxlength'=>36)); ?>
		<?php echo $form->error($model,'saon'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'street'); ?>
		<?php echo $form->textField($model,'street',array('size'=>36,'maxlength'=>36)); ?>
		<?php echo $form->error($model,'street'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'local'); ?>
		<?php echo $form->textField($model,'local',array('size'=>36,'maxlength'=>36)); ?>
		<?php echo $form->error($model,'local'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'city'); ?>
		<?php echo $form->textField($model,'city',array('size'=>36,'maxlength'=>36)); ?>
		<?php echo $form->error($model,'city'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'distt'); ?>
		<?php echo $form->textField($model,'distt',array('size'=>36,'maxlength'=>36)); ?>
		<?php echo $form->error($model,'distt'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'county'); ?>
		<?php echo $form->textField($model,'county',array('size'=>36,'maxlength'=>36)); ?>
		<?php echo $form->error($model,'county'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'recstat'); ?>
		<?php echo $form->textField($model,'recstat',array('size'=>2,'maxlength'=>2)); ?>
		<?php echo $form->error($model,'recstat'); ?>
	</div>

	<div class="row buttons">
		<?php echo CHtml::submitButton($model->isNewRecord ? 'Create' : 'Save'); ?>
	</div>

<?php $this->endWidget(); ?>

</div><!-- form -->