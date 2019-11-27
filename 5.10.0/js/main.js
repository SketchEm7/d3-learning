/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 2 - Gapminder Clone
*/
let margin = { left: 50, top: 30, right: 30, bottom: 80}

let width = 800 - margin.left - margin.right;
let height = 600 - margin.top - margin.bottom;

let g = d3.select("#chart-area")
		  .append("svg")
		  .attr("width", width + margin.right + margin.left)
		  .attr("height", height + margin.top + margin.bottom)
		  .append("g")
		  .attr("transform", `translate(${margin.left}, ${margin.top})`)

let yLabel = g.append("text")
		      .attr("text-anchor", "middle")
		  	  .attr("y", -30)
		  	  .attr("x",-250)
		  	  .attr("font-size", "24px")
		  	  .attr("transform", "rotate(-90)")
		  	  .text("Life Expectancy (Year)")

let xLabel = g.append("text")
			  .attr("font-size", "24px")
			  .attr("text-anchor", "middle")
			  .attr("x", (width/2))
			  .attr("y", (height + 50))
			  .text("GDP Per Capita ($)")

let timeLabel = g.append("text")
				 .attr("opacity", "0.4")
				 .attr("text-anchor", "middle")
				 .attr("font-size", "40px")
				 .attr("x", width-40)
				 .attr("y", height-10)
				 .text("1800")

let area = d3.scaleLinear()
		  	 .range([25*Math.PI, 1500*Math.PI])
		  	 .domain([2000, 1400000000]);

let contColor = d3.scaleOrdinal(d3.schemePastel1);

let time = 0;
let interval;
let cleanData;

let tip = d3.tip().attr('class', 'd3-tip')
	.html(function(d){
		let text = "<strong>Country:</strong> <span style='color:red'>"+ d.country +"</span><br>"
		text += "<strong>Continent:</strong> <span style='color:red;text-transform:capitalize'>"+ d.continent +"</span><br>"
		text += "<strong>Life Expectancy:</strong> <span style='color:red'>"+ d3.format(".2f")(d.life_exp) +"</span><br>"
		text += "<strong>GDP Per Capita:</strong> <span style='color:red'>"+ d3.format("$,.0f")(d.income) +"</span><br>"
		text += "<strong>Population:</strong> <span style='color:red'>"+ d3.format(",.0f")(d.population) +"</span><br>"
		return text;
	});

g.call(tip);

d3.json("data/data.json").then(function(data){

	cleanData = data.map(function(year){
		return year.countries.filter(function(country){
			return (country.income && country.life_exp);
		}).map(function(country){
			country.income = +country.income;
			country.life_exp = +country.life_exp;
			return country;
		})
	})

	update(cleanData[0]);

})

$("#play-button")
	.on("click", function(){
		let button = $(this);
		if (button.text() === "Play"){
			button.text("Pause");
			interval = setInterval(step, 100);	
		} else {
			button.text("Play");
			clearInterval(interval);
		}
		
	})

$("#reset-button")
	.on("click", function(){
		time = 0;
		update(cleanData[0]);
	})

$("#continent-select")
	.on("change", function(){
		update(cleanData[time]);
	})

$("#date-slider").slider({
	max: 2014,
	min: 1800,
	step: 1,
	slide: function(event, ui){
		time = ui.value - 1800;
		update(cleanData[time]);
	}
})

function step(){
	time = (time < cleanData.length) ? ++time : 0;
		update(cleanData[time]);
}

let continents = ["europe", "asia", "americas", "africa"];

let legend = g.append("g")
			  .attr("transform", "translate( " + (width - 10) + ", " + (height - 125) +")" );

continents.forEach(function(continent, i){
	let legendRow = legend.append("g")
						  .attr("transform", "translate(0, "+ (i*20) +")");
						  
	legendRow.append("rect")
			 .attr("width", 10)
			 .attr("height", 10)
			 .attr("fill", contColor(continent));

	legendRow.append("text")
			  .attr("x", -10)
			  .attr("y", 10)
			  .attr("text-anchor", "end")
			  .style("text-transform", "capitalize")
			  .text(continent)
});

let xScale = d3.scaleLog()
			   .domain([300, 150000])
			   .range([0, width])

let yScale = d3.scaleLinear()
			   .range([height, 0])
			   .domain([0, 90])

let xAxisCall = d3.axisBottom(xScale)
				  .tickValues([400, 4000, 40000])
				  .tickFormat(d3.format("$"))
			     g.append("g")
				  .attr("transform", "translate(0 "+ height +" )")
				  .call(xAxisCall);


let yAxisCall = d3.axisLeft(yScale)
			.tickFormat( function(d){
			  return d = +d;
		  })
		  g.append("g")
		   .attr("class", "y axis")
		   .call(yAxisCall);


function update(data){
	let t = d3.transition()
			  .duration(100);

	let continent = $("#continent-select").val();
	

	data = data.filter(function(d){
		if (continent === "all") {
			return true;
		} else {
			return d.continent === continent;
		}
	})

	let circles = g.selectAll("circle")
					.data(data, function(d){
						return d.country;
					});

	circles.exit().remove()

	circles.enter().append("circle")
					.attr("fill", function(d){ return contColor(d.continent)})
					.on("mouseover", tip.show)
					.on("mouseout", tip.hide)
					.merge(circles)
						.transition(t)
						.attr("cx", function(d){
							return xScale(d.income);
						})
						.attr("cy", function(d){
							return yScale(d.life_exp);
						})
						.attr("r", function(d){ return Math.sqrt(area(d.population) / Math.PI) })

	timeLabel.text(+(time+1800));
	$("#year")[0].innerHTML = +(time + 1800);

	$("#date-slider").slider("value", +(time + 1800));
				
}				
