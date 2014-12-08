<?php

class SaleController extends Controller
{
	/**
	 * @var string the default layout for the views. Defaults to '//layouts/column2', meaning
	 * using two-column layout. See 'protected/views/layouts/column2.php'.
	 */
	public $layout='//layouts/column2';

	/**
	 * @return array action filters
	 */
	public function filters()
	{
		return array(
			'accessControl', // perform access control for CRUD operations
			'postOnly + delete', // we only allow deletion via POST request
		);
	}

	/**
	 * Specifies the access control rules.
	 * This method is used by the 'accessControl' filter.
	 * @return array access control rules
	 */
	public function accessRules()
	{
		return array(
			array('allow',  // allow all users to perform 'index' and 'view' actions
				'actions'=>array('index','view','postCode','query'),
				'users'=>array('*'),
			),
			array('deny',  // deny all users
				'users'=>array('*'),
			),
		);
	}

	/**
	 * Displays a particular model.
	 * @param integer $id the ID of the model to be displayed
	 */
	public function actionView($id)
	{
		$this->render('view',array(
			'model'=>$this->loadModel($id),
		));
	}

	/**
	 * Lists all models.
	 */
	public function actionIndex()
	{
		// Include D3.js micro-framework files
		Yii::app()->clientScript->registerScriptFile("http://d3js.org/d3.v3.min.js");
		Yii::app()->clientScript->registerScriptFile("http://d3js.org/topojson.v1.min.js");
		
		// Include the map-making script file after having made it public accessible 
		$filename = Yii::getPathOfAlias('webroot')."/d3.js/onmap.js";
		$jsFile = Yii::app()->getAssetManager()->publish($filename);
		Yii::app()->clientScript->registerScriptFile($jsFile);

		// Make the topojson files public accessible
		$counties = Yii::app()->getAssetManager()->publish(Yii::getPathOfAlias('webroot')."/maps/counties.topojson");
		$ukmap = Yii::app()->getAssetManager()->publish(Yii::getPathOfAlias('webroot')."/maps/uk.topojson");
		
		// Load CSS as well
		$baseUrl = Yii::app()->baseUrl;
		$cs = Yii::app()->getClientScript();
		$cs->registerCssFile($baseUrl.'/css/map.css');				

		
		$this->render('index',array(
			//'resultset'=>$resultset,
			'model'=>new Sale,
		));
	}

	/**
	 * This action is used only using Ajax calls from within index view.
	 */
	public function actionQuery(){
		$model = new Sale;
		if(isset($_GET['Sale']))
			$model->attributes=$_GET['Sale'];
		
		if($model->price == null){
			//echo $model->price;	
		} else {
			//echo $model->price;
			$priceRange = explode("-",$model->price);
			if(count($priceRange) != 2){
				//echo print_r($priceRange);
			} else {
				$model->priceLow = $priceRange[0];
				$model->priceHigh = $priceRange[1];
				//echo print_r($priceRange);
			}
		}

			$criteria = new CDbCriteria;
			$criteria->select = "county, MAX(price) as highestPrice, AVG(price) as averagePrice, COUNT(price) as countOfSale, lat, lng";
			
			if($model->priceLow != 0)
				$criteria->compare('price','>'.$model->priceLow,true);
			if($model->priceHigh != 0)
				$criteria->compare('price','<'.$model->priceHigh,true);
			
 			if($model->soldonLow != null)
				$criteria->compare('soldon','>='.$model->soldonLow,true);
			if($model->soldonHigh != null)
				$criteria->compare('soldon','<='.$model->soldonHigh,true);
//			$criteria->compare('soldon','<2014-01',false);
// 			$criteria->compare('pcode',$model->pcode,true);
// 			$criteria->compare('ptype',$model->ptype,true);
// 			$criteria->compare('isnew',$model->isnew,true);
// 			$criteria->compare('lease',$model->lease,true);
			
			$criteria->join = "LEFT JOIN outcode ON LEFT(pcode,4)=outcode";
			$criteria->compare('county',$model->county,true);
			//$criteria->limit = 100;
			//$criteria->params = array(":price"=> $model->price, ":ptype"=>$model->ptype, ":soldon"=>$model->soldon);
			$criteria->group = "county";
			
			$recs = $model->findAll($criteria);
			$outputArray = [];
			foreach($recs as $rec){
				array_push($outputArray, (object)array(
					'county' => $rec['county'],
			  'averagePrice' => $rec['averagePrice'],
			  'highestPrice' => $rec['highestPrice'],
			   'countOfSale' => $rec['countOfSale'],
					   'lat' => $rec['lat'],
					   'lng' => $rec['lng'],
				));
			}
			echo CJSON::encode($outputArray);
	}		
	
	/**
	 * Returns the data model based on the primary key given in the GET variable.
	 * If the data model is not found, an HTTP exception will be raised.
	 * @param integer $id the ID of the model to be loaded
	 * @return Sale the loaded model
	 * @throws CHttpException
	 */
	public function loadModel($id)
	{
		$model=Sale::model()->findByPk($id);
		if($model===null)
			throw new CHttpException(404,'The requested page does not exist.');
		return $model;
	}

	/**
	 * Performs the AJAX validation.
	 * @param Sale $model the model to be validated
	 */
	protected function performAjaxValidation($model)
	{
		if(isset($_POST['ajax']) && $_POST['ajax']==='sale-form')
		{
			echo CActiveForm::validate($model);
			Yii::app()->end();
		}
	}
	
	public function actionPostCode($term){
		//echo $term;
		$sql = "select DISTINCT(SUBSTR(pcode,1,INSTR(pcode,' ')-1)) as pcode
				from sale where pcode like '$term%'";
		//echo $sql;
		$list = Yii::app()->db->createCommand($sql)->queryAll();
		$rs=array();
		foreach($list as $item)
			$rs[]=$item['pcode'];
		echo CJSON::encode($rs);
	}	
}
