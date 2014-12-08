//global variables
var map_tag,
	path,
	arrPostCodes = [],
	jsonpipe = [],
	formData;

var width = 900,
	height = 700;

var projection;

var svg;

/**
 * Document onload sets up the SVG map into the div area.
 * Also registers the checkbox for showing-hiding the county names.
 * Kicks of the count of house sale for the search parameters (via GET)
 */
$(document).ready(function() {
	/** Assign svg to the div element. This part would be called as soon as the document loads.
	 *	which also means that drawMap() function has already initiated. The following 3 lines
	 *	merely places the svg into the div.
	 */
	d3.select("body").transition().duration(2000).style("color", "red");
	
	svg = d3.select(".map").append("svg")
		.attr("width", width)
		.attr("height", height);
	
	// Now call the plot funciton on the aggregation of count (default)
	
	$(":checkbox").change(function (){
		if($(this).is(":checked")) {
			$(this).attr("checked", true);
			svg.selectAll(".subunit-label")
			.data(topojson.feature(map_tag, map_tag.objects.uk).features)
			.enter().append("text")
			    .attr("class", function(d) { return "subunit-label " + d.properties.ID_1; })
			    .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
			    .attr("dy", ".35em")
				    .text(function(d) { return d.properties.NAME_2; });
		 } else {
			$(this).attr("checked", false);
			svg.selectAll(".subunit-label")
				.remove();				        
		}
	});
	
	// Call the default view once the search action is taken
	$("select").change(function (){
		getGoing('count');
	});
	
	$("input").change(function (){
		getGoing('count');
	});


	$('form').submit(function(event) {
		// get the form data
		// there are many ways to get this data using jQuery (you can use the class or id also)
	});
}); //document.body.ready


/**
 * The processing unit upon user selecting all the parameters. It checks the options user has selected and processes
 * accordingly, viz, the selected display parameters and the aggregate function.
 */
function getGoing(aggrType){
	
	if(aggrType == null) attrType = 'count';
	
	jsonpipe = [];	//re-initializing jsonpipe
	
	clearCircles();				//removing earlier circles
	
	formData = {
		'Sale[price]'		: $('select[name=Sale\\[price\\]]').val(),
		'Sale[soldonLow]'	: $('select[name=Sale\\[soldonLow\\]]').val(),
		'Sale[soldonHigh]'	: $('select[name=Sale\\[soldonHigh\\]]').val(),
		'Sale[pcode]'		: $('input[name=Sale\\[pcode\\]]').val(),
		'Sale[ptype]'		: $('input[name=Sale\\[ptype\\]]').val(),
		'Sale[isnew]'		: $('input[name=Sale\\[isnew\\]]').val(),
		'Sale[lease]'		: $('input[name=Sale\\[lease\\]]').val(),
		'Sale[city]' 		: $('input[name=Sale\\[city\\]]').val(),
		'Sale[county]'		: $('input[name=Sale\\[county\\]]').val(),
	   'Sale[aggregateType]': $('select[name=Sale\\[aggregateType\\]').val(),
	 };

	//console.log(formData);
	
	$.ajax({
		type: 'GET',
		url: '/koding/mapapp/index.php/sale/query', //?' + window.location.search.substring(1),	// following the pattern of (controller/action)
		data: formData,
		dataType: 'json',
		success: function (result) {
			for(var i=0; i<result.length; i++){
				if(jsonpipe.length > 100) jsonpipe.shift();
					jsonpipe.push(result[i]);
				}
			//console.log("URL should be -" + decodeURI(this.url));
			//console.log(JSON.stringify(jsonpipe));
		},
		complete: function (result) {
			overlayCountOfSale();
		}
	});

//	} else if(plotType == "one_month"){
//		jsonpipe = [];
//		var temp = $("#pmonth").val();
////		var month = parseInt(temp.substring(5, 7));
////		var year  = parseInt(temp.substring(0, 4));
//		$.ajax({
//			type: 'GET',
//			url: 'duration.php',
//			data: {"pmonth": temp, "aggregate": aggregate},	//temp format - YYYY-DD; the webservice will suffix 01 and 30/31
//			dataType: 'json',
//			success: function (result) {
//				for(var i=0; i<result.length; i++){
//				//if(jsonpipe.length > 100) jsonpipe.shift();
//					console.log(result[i]);
//					jsonpipe.push(result[i]);
//				}
//				//console.log("reading data "+tick);
//			},
//			complete: function (result) {
//				showPlots(jsonpipe);
//			}
//		});			
//	} else if(plotType == "month_range") {
//		jsonpipe = [];
//		var temp1 = $("#pmonth1").val();
//		var temp2 = $("#pmonth2").val();
//		$.ajax({
//			type: 'GET',
//			url: 'duration.php',
//			data: {pmonth1: temp1, pmonth2: temp2, aggregate: aggregate},	//temp format - YYYY-DD; the webservice will suffix 01 and 30/31
//			dataType: 'json',
//			success: function (result) {
//				for(var i=0; i<result.length; i++){
//				//if(jsonpipe.length > 100) jsonpipe.shift();
//					jsonpipe.push(result[i]);
//				}
//				//console.log("reading data "+tick);
//			},
//			complete: function (result) {
//				// overlayPostcodes();
//				document.write(JSON.stringify(result));
//			}
//		});
//	} else if(plotType == "price_range") {
//	} else {	//area_codes
//	}
}	




//This example is from http://bost.ocks.org/mike/map/

/** 
 * Functions to activate loading
 */ 
function showPlots(jsonpipe){
	console.log(JSON.stringify(jsonpipe));
	var circle = svg.selectAll("circle")
		.data(jsonpipe);

	circle.enter().append("circle")
		.attr("cx", function(d) { return projection([d.lng, d.lat])[0];})
		.attr("cy", function(d) { return projection([d.lng, d.lat])[1];})
		.attr("r",  function(d) { return d.count/25000;})
		.style("stroke", "green")
		.style("fill", "green");
}


/**
 *  Populates the map with bubbles for each sale where the size of the bubble is proportionate to its price value
 */
function overlayPostcodes(){
	var circle = svg.selectAll("circle")
			.data(jsonpipe);
	
		circle.enter().append("circle")
			.attr("cx", function(d) { return projection([d.lng, d.lat])[0];})
			.attr("cy", function(d) { return projection([d.lng, d.lat])[1];})
			.attr("r",  function(d) { return d.price/25000;})
			.style("stroke", "green")
			.style("fill", "yellow");

		circle.transition()
			.duration(1000)
			.attr("r", function(d) { return d.price/100000;});

		circle.exit().remove();
}

function clearCircles(){
	svg.selectAll("circle")
		.remove();
}

function overlayCountOfSale(){
//	svg.selectAll("circle")
//		.data(jsonpipe)
//	.enter().append('text')
//		.attr("transform", function(d) {
//				//console.log(d.lng + ", " + d.lat);
//				return "translate(" + projection([d.lng, d.lat])[0] + "," + projection([d.lng, d.lat])[1] + ")"; 
//			})
//		.attr("dy", ".35em")
//		.text(function(d){ return d.countOfSale;});
		
		svg.selectAll("circle")
			.data(jsonpipe)
			.enter().append("circle")
				.attr("cx", function(d) { return projection([d.lng, d.lat])[0];})
				.attr("cy", function(d) { return projection([d.lng, d.lat])[1];})
				.attr("r", 25)
				.style("stroke", "green")
				.style("fill", "lightyellow")
			.transition()
				.duration(1000)
				.attr("r", function(d) { return d.countOfSale;})
			;
			
//		circle.exit().remove();
}


/**
 *	Draws the map in the view area using the hardcoded Topo-JSON data files.
 */
 function drawMap(baseUrl, labelsOn){

	 d3.json(baseUrl + "/maps/counties.topojson", function(error, uk) {
		if (error)
			alert("may day, may day"); //return console.error(error);
	  	
		map_tag = uk; //assign to a global variable
	  	
		d3.json(baseUrl + "/maps/uk.topojson", function(errorr, ukir){
			if(errorr)
				alert("may day n ireland");
				
		  	var subunits_ireland = topojson.feature(ukir, ukir.objects.subunits);
		  	var subunits = topojson.feature(uk, uk.objects.uk);
		  	
		  	projection = d3.geo.albers()
			    .center([0, 54.2])
			    .rotate([4.4, 0]) //in radians?
			    .parallels([50, 60])
			    .scale(4000)
			    .translate([width/2, height/2]);
		    
		  	// attach the projecton to the path
		  	path = d3.geo.path()
		  	    .projection(projection);
		  	  	
		  	// attach the path for Ireland
			svg.append("path")
				.datum(subunits_ireland)
				.attr("d", path);
	
			//attach the path for UK (this layer should be above Ireland)
	  	    svg.append("path")
				.datum(subunits)
				.attr("d", path);
			
	  	    //Provide a feature to Ireland else it will be black in colour
			svg.selectAll(".subunit_ireland")
		    	.data(topojson.feature(ukir, ukir.objects.subunits).features)
			.enter().append("path")
		    	.attr("class", function(d) { //console.log("subunit_ireland_" + d.id); 
			    	return "subunit_ireland_" + d.id; })
		    	.attr("d", path);
	
			//Provider features to UK map - one colour to one country
			svg.selectAll(".subunit")
		    	.data(topojson.feature(uk, uk.objects.uk).features)
			.enter().append("path")
		    	.attr("class", function(d) { //console.log("subunit_" + d.properties.ID_1); 
			    	return "subunit_" + d.properties.ID_1; })
		    	.attr("d", path);
			
	//     	svg.append("path")
	// 		    .datum(topojson.mesh(uk, uk.objects.uk, function(a, b) { return a !== b && a.id !== "IRL"; }))
	// 		    .attr("d", path)
	// 		    .attr("class", "subunit-boundary");
		    
	//     	svg.append("path")
	// 		    .datum(topojson.mesh(ukir, ukir.objects.subunits, function(a, b) { return a !== b && a.id !== "IRL"; }))
	// 		    .attr("d", path)
	// 		    .attr("class", "subunit-boundary");
			    
	// 	svg.append("path")
	// 	    .datum(topojson.mesh(uk, uk.objects.uk, function(a, b) { return a === b && a.id === "IRL"; }))
	// 	    .attr("d", path)
	// 	    .attr("class", "subunit-boundary IRL");
	
	// 	svg.append("path")
	// 	    .datum(topojson.feature(uk, uk.objects.places))
	// 	    .attr("d", path)
	// 	    .attr("class", "place");
	
	// 	svg.selectAll(".place-label")
	// 			.data(topojson.feature(uk, uk.objects.places).features)
	// 		.enter().append("text")
	// 			.attr("class", "place-label")
	// 			.attr("transform", function(d) { return "translate(" + projection(d.geometry.coordinates) + ")"; })
	// 			.attr("dy", ".35em")
	// 			.text(function(d) { return d.properties.name; });
	
	// 	svg.selectAll(".place-label")
	// 	    .attr("x", function(d) { return d.geometry.coordinates[0] > -1 ? 6 : -6; })
	// 	    .style("text-anchor", function(d) { return d.geometry.coordinates[0] > -1 ? "start" : "end"; });
	
	});
	
	});
} //end of function drawMap

