/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 1 - Star Break Coffee
*/

let margin = { left:80, right:20, top:50, bottom:100 }

let width = 600 - margin.left - margin.right;
let height = 400 - margin.top - margin.bottom;

let g = d3.select("#chart-area")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform", "translate(" + margin.left +","+ margin.top +")");



//X LABEL
g.append("text")
    .attr("y", height + 50)
    .attr("x", width/2)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Month")

// Y LABEL
g.append("text")
    .attr("y", -60)
    .attr("x", -(height / 2))
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Revenue")

d3.json("data/revenues.json").then(function(data){
    data.map( function(d){ 
        d.revenue = +d.revenue
    })

    let xScale = d3.scaleBand()
                   .domain(data.map(function(d){
                       return d.month;
                   }))
                   .range([0, width])
                   .paddingInner(0.3)
                   .paddingOuter(0.3);

    let yScale = d3.scaleLinear()
                   .domain([0, d3.max(data, function(d){
                       return d.revenue
                   })])
                   .range([height, 0]);

    let xAxis =  d3.axisBottom(xScale)
                  g.append("g")
                   .attr("class", " x-axis")
                   .attr("transform", "translate(0, " + height + ")")
                   .call(xAxis);
                  

    let yAxis = d3.axisLeft(yScale);
                 g.append("g")
                  .attr("class", "y-axis")
                  .call(yAxis);


    let rects = g.selectAll("rect")
                 .data(data);

    rects.enter()
         .append("rect")
         .attr("y", function(d){ return yScale(d.revenue); })
         .attr("x", function(d){ return xScale(d.month); })
         .attr("width", xScale.bandwidth)
         .attr("height", function(d){ return height - yScale(d.revenue)})
         .attr("fill", "grey");

})