<?php
/* @var $this SaleController */
/* @var $data Sale */
?>

<div class="view">

	<b><?php echo CHtml::encode($data->getAttributeLabel('id')); ?>:</b>
	<?php echo CHtml::link(CHtml::encode($data->id), array('view', 'id'=>$data->id)); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('price')); ?>:</b>
	<?php echo CHtml::encode($data->price); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('soldon')); ?>:</b>
	<?php echo CHtml::encode($data->soldon); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('pcode')); ?>:</b>
	<?php echo CHtml::encode($data->pcode); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('ptype')); ?>:</b>
	<?php echo CHtml::encode($data->ptype); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('isnew')); ?>:</b>
	<?php echo CHtml::encode($data->isnew); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('lease')); ?>:</b>
	<?php echo CHtml::encode($data->lease); ?>
	<br />

	<?php /*
	<b><?php echo CHtml::encode($data->getAttributeLabel('paon')); ?>:</b>
	<?php echo CHtml::encode($data->paon); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('saon')); ?>:</b>
	<?php echo CHtml::encode($data->saon); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('street')); ?>:</b>
	<?php echo CHtml::encode($data->street); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('local')); ?>:</b>
	<?php echo CHtml::encode($data->local); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('city')); ?>:</b>
	<?php echo CHtml::encode($data->city); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('distt')); ?>:</b>
	<?php echo CHtml::encode($data->distt); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('county')); ?>:</b>
	<?php echo CHtml::encode($data->county); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('recstat')); ?>:</b>
	<?php echo CHtml::encode($data->recstat); ?>
	<br />

	*/ ?>

</div>