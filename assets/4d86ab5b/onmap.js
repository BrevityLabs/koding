//global variables
var map_tag,
	path,
	arrPostCodes = [],
	jsonpipe = [],
	tick = 0;

var width = 900,
	height = 700;

var projection;

var svg;

/**
 * Utility function to get GET parameters
 */
function getUrlParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
            return sParameterName[1];
        }
    }
}  

/**
 * The processing unit upon user selecting all the parameters. It checks the options user has selected and processes
 * accordingly, viz, the selected display parameters and the aggregate function.
 */
function getGoing(aggrType){
	//console.log(aggrType);
	if(aggrType == null) attrType = 'count';
	//var plotType  = $("input:radio[name=plotType]:checked").val();
	//var aggregate = $("input:radio[name=aggregate_by]:checked").val();
	//console.log (plotType + ", " + aggregate);

	//if(plotType == "full_year"){	//time and resource consuming animation. make animation smooth
		jsonpipe = [];
			//console.log(tick + ": Size of jsonpipe " + jsonpipe.length);
	   $.ajax({
			   type: 'GET',
			   url: '/koding/mapapp/index.php/sale/query?aggr=' + aggrType + "&" + window.location.search.substring(1),	// following the pattern of (controller/action)
			   data: {aggr: aggrType},
			   dataType: 'json',
			   success: function (result) {
				   for(var i=0; i<result.length; i++){
					   if(jsonpipe.length > 100) jsonpipe.shift();
					   jsonpipe.push(result[i]);
				   }
				   console.log(JSON.stringify(jsonpipe));
			   },
			   complete: function (result) {
//					jsonpipe = [{"county":"","sumOfPrice":"60000","countOfSale":"1","lat":"51.337221","lng":"1.410257"},{"county":"ABINGDON","sumOfPrice":"975000","countOfSale":"1","lat":"51.660117","lng":"-1.252979"},{"county":"ADDLESTONE","sumOfPrice":"229000","countOfSale":"1","lat":"51.363000","lng":"-0.494000"},{"county":"ADUR","sumOfPrice":"8927150","countOfSale":"39","lat":"50.838028","lng":"-0.322340"},{"county":"ALDERSHOT","sumOfPrice":"222500","countOfSale":"2","lat":"51.252938","lng":"-0.761280"},{"county":"ALFRETON","sumOfPrice":"90000","countOfSale":"1","lat":"53.101000","lng":"-1.371000"},{"county":"ALLERDALE","sumOfPrice":"6836967","countOfSale":"41","lat":"54.602000","lng":"-3.133000"},{"county":"ALTRINCHAM","sumOfPrice":"569000","countOfSale":"2","lat":"53.378512","lng":"-2.314201"},{"county":"AMBER VALLEY","sumOfPrice":"11822140","countOfSale":"72","lat":"53.048196","lng":"-1.405241"},{"county":"AMERSHAM","sumOfPrice":"850000","countOfSale":"1","lat":"51.660581","lng":"-0.618655"},{"county":"ARUN","sumOfPrice":"34197048","countOfSale":"129","lat":"50.818779","lng":"-0.430321"},{"county":"ASCOT","sumOfPrice":"1754950","countOfSale":"3","lat":"51.405481","lng":"-0.664241"},{"county":"ASHFIELD","sumOfPrice":"8415535","countOfSale":"62","lat":"53.056030","lng":"-1.196679"},{"county":"ASHFORD","sumOfPrice":"19649190","countOfSale":"74","lat":"51.134456","lng":"0.840505"},{"county":"ATTLEBOROUGH","sumOfPrice":"430000","countOfSale":"1","lat":"52.517025","lng":"0.970347"},{"county":"AYLESBURY","sumOfPrice":"1329950","countOfSale":"3","lat":"51.821403","lng":"-0.920622"},{"county":"AYLESBURY VALE","sumOfPrice":"35153906","countOfSale":"126","lat":"51.770898","lng":"-0.858398"},{"county":"BABERGH","sumOfPrice":"14627994","countOfSale":"42","lat":"52.019778","lng":"0.698861"},{"county":"BAGSHOT","sumOfPrice":"452500","countOfSale":"1","lat":"51.363294","lng":"-0.692352"},{"county":"BANSTEAD","sumOfPrice":"618000","countOfSale":"3","lat":"51.321281","lng":"-0.198481"},{"county":"BARKING","sumOfPrice":"500000","countOfSale":"3","lat":"51.534020","lng":"0.099884"},{"county":"BARKING AND DAGENHAM","sumOfPrice":"13597840","countOfSale":"63","lat":"51.534020","lng":"0.099884"},{"county":"BARNET","sumOfPrice":"84611876","countOfSale":"140","lat":"51.654983","lng":"-0.162440"},{"county":"BARNOLDSWICK","sumOfPrice":"98000","countOfSale":"1","lat":"53.911020","lng":"-2.165807"},{"county":"BARNSLEY","sumOfPrice":"11946881","countOfSale":"100","lat":"53.504994","lng":"-1.661897"}];	
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


$(document).ready(function() {
	/** Assign svg to the div element. This part would be called as soon as the document loads.
	 *	which also means that drawMap() function has already initiated. The following 3 lines
	 *	merely places the svg into the div.
	 */
	svg = d3.select(".map").append("svg")
		.attr("width", width)
		.attr("height", height);
	
	// Now call the plot funciton on the aggregation of count (default)
	
	$(":checkbox").change(function (){
		if($(this).is(":checked")) {
			$(this).attr("checked", true);
			svg.selectAll(".subunit-label")
				.remove();
		 } else {
			$(this).attr("checked", false);
			svg.selectAll(".subunit-label")
				.data(topojson.feature(map_tag, map_tag.objects.uk).features)
				.enter().append("text")
				    .attr("class", function(d) { return "subunit-label " + d.properties.ID_1; })
				    .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
				    .attr("dy", ".35em")
					    .text(function(d) { return d.properties.NAME_2; });	        
		}
	}
);
	
}); //document.body.ready




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
				.attr("r",  function(d) { return d.countOfSale/10;})
				.style("stroke", "green")
				.style("fill", "yellow")
			.append("title")
				.text(function(d){ return d.county +"-"+ d.countOfSale;});

//		circle.transition()
//			.duration(1000)
//			.attr("r", function(d) { return d.price/100000;});

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
	
		//If user wants labels then add labels as a feature - only UK part.
		if(labelsOn){
			svg.selectAll(".subunit-label")
					.data(topojson.feature(uk, uk.objects.uk).features)
//				.enter().append("text")
//				    .attr("class", function(d) { return "subunit-label " + d.properties.ID_1; })
//				    .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
//				    .attr("dy", ".35em")
				    .append("svg:title")
					.text(function(d) { console.log(d.properties.NAME_2); return d.properties.NAME_2; })
						.attr("dy", ".35em");
		}
	});
	
	});
} //end of function drawMap

