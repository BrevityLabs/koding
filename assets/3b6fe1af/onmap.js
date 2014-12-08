//global variables
var map_tag,
	path,
	arrPostCodes = [],
	jsonpipe = [],
	tick = 0;
   
//$(function() {
//
//	function log( message ) {
//		$( "<div>" ).text( message ).prependTo( "#log" );
//		$( "#log" ).scrollTop( 0 );
//	  }
//  	  
//	var cache = {};
//	$( "#ppcode" ).autocomplete({
//	  minLength: 2,
//	  source: function( request, response ) {
//		var term = request.term;
//		if ( term in cache ) {
//		  response( cache[ term ] );
//		  return;
//		}
// 
//		$.getJSON( "postcodes.php", request, function( data, status, xhr ) {
//		  cache[ term ] = data;
//		  response( data );
//		});
//	  },
//	  select: function( event, ui ) {
//		  if(ui.item)
//			log( ui.item.value  );
//	   	return false;
//	  }
//	});
//});


function getGoing(){
		var plotType  = $("input:radio[name=plotType]:checked").val();
		var aggregate = $("input:radio[name=aggregate_by]:checked").val();
		console.log (plotType + ", " + aggregate);
		
		if(plotType == "full_year"){	//time and resource consuming animation. make animation smooth
			tick = 0;
			jsonpipe = [];
			d3.timer(function() {
				//console.log(tick + ": Size of jsonpipe " + jsonpipe.length);
			   $.ajax({
					   type: 'GET',
					   url: 'increment.php',
					   data: {tick: tick, aggregate: aggregate},
					   dataType: 'json',
					   success: function (result) {
						   for(var i=0; i<result.length; i++){
							   if(jsonpipe.length > 100) jsonpipe.shift();
							   jsonpipe.push(result[i]);
						   }
					   	//console.log("reading data "+tick);
					   },
					   complete: function (result) {
						  overlayPostcodes();
					   }
			   });
			   tick++;
			}, 5000);
		} else if(plotType == "one_month"){
			jsonpipe = [];
			var temp = $("#pmonth").val();
// 			var month = parseInt(temp.substring(5, 7));
// 			var year  = parseInt(temp.substring(0, 4));

			$.ajax({
				type: 'GET',
				url: 'duration.php',
				data: {"pmonth": temp, "aggregate": aggregate},	//temp format - YYYY-DD; the webservice will suffix 01 and 30/31
				dataType: 'json',
				success: function (result) {
					for(var i=0; i<result.length; i++){
					//if(jsonpipe.length > 100) jsonpipe.shift();
						console.log(result[i]);
						jsonpipe.push(result[i]);
					}
					//console.log("reading data "+tick);
				},
				complete: function (result) {
					showPlots(jsonpipe);
				}
			});
					
		} else if(plotType == "month_range") {
			jsonpipe = [];
			var temp1 = $("#pmonth1").val();
			var temp2 = $("#pmonth2").val();
			$.ajax({
				type: 'GET',
				url: 'duration.php',
				data: {pmonth1: temp1, pmonth2: temp2, aggregate: aggregate},	//temp format - YYYY-DD; the webservice will suffix 01 and 30/31
				dataType: 'json',
				success: function (result) {
					for(var i=0; i<result.length; i++){
					//if(jsonpipe.length > 100) jsonpipe.shift();
						jsonpipe.push(result[i]);
					}
					//console.log("reading data "+tick);
				},
				complete: function (result) {
					// overlayPostcodes();
					document.write(JSON.stringify(result));
				}
			});
			
		} else if(plotType == "price_range") {
		} else {	//area_codes
		}
}	


$(document).ready(function() {
	var dmax, dmin, pmin, pmax;
	var durantionInMonths=0;
	var option2 = $("#pmonth1");
	var option3 = $("#pmonth2");
	var option4 = $("#plprice");
	var option5 = $("#puprice");
	

//Ajax call to the webservice
// 	$.ajax({
//     	type: 'GET',
//         url: 'pricerange.php',		//returns first and last dates in YYYY-MM-DD format
//         dataType: 'json',
//         success: function (result) {
//             pmax = Math.ceil(result.max/100000) * 100000;
//             pmin = 0; Math.floor(result.min/100000) * 100000;
            
//         },
//         complete: function (result) {
//             //$("#pmonth").find('option').remove();

//             for(var i=pmin; i<=pmax; i+=500000) {
//             	 //console.log(mth);
//            		option4.append("<option value='i'>" + i + "</option>");
//            		option5.append("<option value='i'>" + i + "</option>");
// 			}
// 		}
// 	});

	$(":checkbox").change(function(){
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
	 });
	
}); //document.body.ready


//This example is from http://bost.ocks.org/mike/map/

var  width = 900,
    height = 700;

var svg = d3.select(".map").append("svg")
    .attr("width", width)
    .attr("height", height);
	
var projection;
var x;
/** Functions to activate loading
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



/**
 *	Draws the map in the view area using the hardcoded Topo-JSON data files.
 */
 function drawMap(baseUrl, labelsOn){

	 d3.json(baseUrl + "/maps/counties.topojson", function(error, uk) {
		if (error)
			alert("may day, may day"); //return console.error(error);
	  	
		map_tag = uk;
	  	
		d3.json(baseUrl + "/maps/uk.topojson", function(errorr, ukir){
			if(errorr)
				alert("may day n ireland");
				
		  	var subunits_ireland = topojson.feature(ukir, ukir.objects.subunits);
		  	var subunits = topojson.feature(uk, uk.objects.uk);
		  	
		  	projection = d3.geo.albers()
			    .center([0, 54.2])
			    .rotate([4.4, 0]) //in radians?
			    .parallels([50, 60])
			    .scale(5000)
			    .translate([width / 2, height / 2]);
		    
		  	path = d3.geo.path()
		  	    .projection(projection);
		  	  	
			svg.append("path")
				.datum(subunits_ireland)
				.attr("d", path);
	
	  	    svg.append("path")
				.datum(subunits)
				.attr("d", path);
				
			svg.selectAll(".subunit_ireland")
		    	.data(topojson.feature(ukir, ukir.objects.subunits).features)
			.enter().append("path")
		    	.attr("class", function(d) { //console.log("subunit_ireland_" + d.id); 
			    	return "subunit_ireland_" + d.id; })
		    	.attr("d", path);
	
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
	
		if(labelsOn){
			svg.selectAll(".subunit-label")
					.data(topojson.feature(uk, uk.objects.uk).features)
				.enter().append("text")
				    .attr("class", function(d) { return "subunit-label " + d.properties.ID_1; })
				    .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
				    .attr("dy", ".35em")
				    .text(function(d) { return d.properties.NAME_2; });
		}
	});
	
	});
} //end of function drawMap

