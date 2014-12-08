<?php

/**
 * This is the model class for table "sale".
 *
 * The followings are the available columns in table 'sale':
 * @property string $id
 * @property string $price
 * @property string $soldon
 * @property string $pcode
 * @property string $ptype
 * @property string $isnew
 * @property string $lease
 * @property string $paon
 * @property string $saon
 * @property string $street
 * @property string $local
 * @property string $city
 * @property string $distt
 * @property string $county
 * @property string $recstat
 */
class Sale extends CActiveRecord
{
	/*
	 * The following properties are set because CDBCriteria would not return aggregates unless they are part of the model
	 */
	public $countOfSale;		// equivalent to COUNT(*)
	public $sumOfPrice;			// equivalent to SUM(price)
	public $lat;
	public $lng;
	
	/**
	 * The following properties are added for searching on a range of parameter values (low-high)
	 */
	public $priceLow;
	public $priceHigh;
	public $postcodeLow;
	public $postcodeHigh;
	private $soldonLow;	//<<< note it is private
	private $soldonHigh;
	private $aggregateType;
	
	/* These are a bunch of virtual attributes which GET or POST methods will fail to set if their
	 * getter and setter methods are not defined. The corresponding variables are private, which 
	 * also declared as 'safe' in the rules() method. Note: setAttributes() have been overridden.
	 */
	public function setSoldonLow($val) 	{
		$this->soldonLow = $val;		}
	public function getSoldonLow()		{
		return $this->soldonLow;		}
	public function setSoldonHigh($val) {
		$this->soldonHigh = $val;		}
	public function getSoldonHigh()		{
		return $this->soldonHigh;		}
	public function setAggregateType($val){
		$this->aggregateType = $val;	}
	public function getAggregateType()	{
		return $this->aggregateType;	}

	/**
	 * @return string the associated database table name
	 */
	public function tableName()
	{
		return 'sale';
	}

	/**
	 * @return array validation rules for model attributes.
	 */
	public function rules()
	{
		// NOTE: you should only define rules for those attributes that
		// will receive user inputs.
		return array(
			array('id, soldon, pcode, ptype, isnew, lease', 'required'),
			array('id', 'length', 'max'=>40),
			array('price, soldon', 'length', 'max'=>20),
			array('pcode', 'length', 'max'=>10),
			array('ptype, isnew, lease', 'length', 'max'=>1),
			array('paon, saon, street, local, city, distt, county', 'length', 'max'=>36),
			array('recstat', 'length', 'max'=>2),
			// The following rule is used by search().
			// @todo Please remove those attributes that should not be searched.
			array('id, price, soldon, pcode, ptype, isnew, lease, paon, saon, street,
					local, city, distt, county, recstat, soldonLow, soldonHigh, aggregateType', 'safe', 'on'=>'search'),
		);
	}

	/**
	 * @return array relational rules.
	 */
	public function relations()
	{
		// NOTE: you may need to adjust the relation name and the related
		// class name for the relations automatically generated below.
		return array(
			//'latlong' => array(self::HAS_ONE, 'Outcode', array('LEFT(pcode,4)' => 'outcode')),
		);
	}

	/**
	 * @return array customized attribute labels (name=>label)
	 */
	public function attributeLabels()
	{
		return array(
			'id' => 'ID',
			'price' => 'Price',
			'soldon' => 'Sold on',
			'pcode' => 'Area code',
			'ptype' => 'Property type',
			'isnew' => 'Is new',
			'lease' => 'Lease',
			'paon' => 'Primary address no',
			'saon' => 'Primary address no',
			'street' => 'Street',
			'local' => 'Local',
			'city' => 'City',
			'distt' => 'District',
			'county' => 'County',
			'recstat' => 'Record status',
			'soldbetwn'=> 'Sold between',
		);
	}

	/**
	 * Retrieves a list of models based on the current search/filter conditions.
	 *
	 * Typical usecase:
	 * - Initialize the model fields with values from filter form.
	 * - Execute this method to get CActiveDataProvider instance which will filter
	 * models according to data in model fields.
	 * - Pass data provider to CGridView, CListView or any similar widget.
	 *
	 * @return CActiveDataProvider the data provider that can return the models
	 * based on the search/filter conditions.
	 */
	public function search($aggr)
	{
		if(isset($_GET['Sale']))
			$this->attributes=$_GET['Sale'];
		
		if($this->price == null){
			//echo $model->price;
		} else {
			//echo $model->price;
			$priceRange = explode("-",$this->price);
			if(count($priceRange) != 2){
				//echo print_r($priceRange);
			} else {
				$this->priceLow = $priceRange[0];
				$this->priceHigh = $priceRange[1];
				//echo print_r($priceRange);
			}
		}
		
		if($aggr == 'count'){
			$criteria = new CDbCriteria;
			$criteria->select = "county, SUM(price) as sumOfPrice, COUNT(price) as countOfSale, lat, lng";
				
			if($this->priceLow != 0)
				$criteria->compare('price','>'.$this->priceLow,true);
			if($this->priceHigh != 0)
				$criteria->compare('price','<'.$this->priceHigh,true);
				
			if($this->soldonLow != null)
				$criteria->compare('soldon','>='.$this->soldonLow,true);
			if($this->soldonHigh != null)
				$criteria->compare('soldon','<='.$this->soldonHigh,true);
			//			$criteria->compare('soldon','<2014-01',false);
			// 			$criteria->compare('pcode',$model->pcode,true);
			// 			$criteria->compare('ptype',$model->ptype,true);
			// 			$criteria->compare('isnew',$model->isnew,true);
			// 			$criteria->compare('lease',$model->lease,true);
				
			$criteria->join = "LEFT JOIN outcode ON LEFT(pcode,4)=outcode";
			$criteria->compare('county',$this->county,true);
			$criteria->limit = 100;
			//$criteria->params = array(":price"=> $model->price, ":ptype"=>$model->ptype, ":soldon"=>$model->soldon);
			$criteria->group = "county";
				
			$recs = $this->findAll($criteria);
			$outputArray = [];
			foreach($recs as $rec){
				array_push($outputArray, (object)array(
				'county'=>$rec['county'],
				'sumOfPrice'=>$rec['sumOfPrice'],
				'countOfSale'=>$rec['countOfSale'],
				'lat'=>$rec['lat'],
				'lng'=>$rec['lng'],
				));
			}
			//echo CJSON::encode($outputArray);
			return $outputArray;
		}
	}

	/**
	 * Returns the static model of the specified AR class.
	 * Please note that you should have this exact method in all your CActiveRecord descendants!
	 * @param string $className active record class name.
	 * @return Sale the static model class
	 */
	public static function model($className=__CLASS__)
	{
		return parent::model($className);
	}
	
	/*
	 * Static method to provide the month-year range ...
	 */	
	public static function periodRange(){
		$list = Yii::app()->db->createCommand('select left(soldon, 7) as mnth from sale group by 1 order by 1')->queryAll();
		$rs=array();
		foreach($list as $item)
			$rs[$item['mnth']]=$item['mnth'];
		//add one more item
		$myDate = new DateTime($item['mnth'] . '-01');
		$myDate->add(new DateInterval('P1M'));
		$strMyDate = date_format($myDate, "Y-m");
		$rs[$strMyDate]=$strMyDate;
		
		return $rs;
	}
	/**
	 * Static method to find price categories (max 10 categories)
	 * @return multitype:unknown
	 */
	public static function priceRange(){
		return array('0-0'=>'All prices', '0-50000'=>'Below 50000','50000-100000'=>'50001-100000',
					'100001-150000'=>'100001-150000','150001-200000'=>'150001-200000',
					'200001-250000'=>'200001-250000','250001-300000'=>'250001-300000',
					'300000-0'=>'Above 300001');
	}

	
	//some experiment
	public function setAttributes($values, $safeOnly = true) {
		if (!is_array($values))
			return;
		$attributes = array_flip($safeOnly ? $this->getSafeAttributeNames() : $this->attributeNames());
		foreach ($values as $name => $value) {
			$nameRest = substr($name, 1);
			$func = 'set' . strtoupper($name[0]) . $nameRest;
			if (method_exists($this, $func)) {
				$this->$func($value);
			} else if (isset($attributes[$name]))
				$this->$name = $value;
			else if ($safeOnly)
				$this->onUnsafeAttribute($name, $value);
		}
	}
	
}
