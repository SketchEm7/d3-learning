let svgCanvas = d3.select("#chart-area")
                    .append("svg")
                    .attr("width", 500)
                    .attr("height", 500)


d3.json("data/buildings.json").then(function(data){
    console.log(data);
    data.forEach(building => {
        building.height = +building.height;
        console.log(building.height);
    });

    let rects = svgCanvas.selectAll("rect")
                         .data(data)
                         .enter().append("rect")
                         .attr("y", 0)
                         .attr("x", function(d, i){
                             return (i*60);
                         })
                         .attr("width", 40)
                         .attr("height", function(d){
                             return d.height;
                         })
                         .attr("fill", function(d){
                             return "grey";
                         })
})




// let ellipse = svgCanvas.append("ellipse")
//                 .attr("cx", 150)
//                 .attr("cy", 150)
//                 .attr("rx", 150)
//                 .attr("ry", 75)
//                 .attr("fill", "purple")

// let rect = svgCanvas.append("rect")
//                 .attr("x", 200)
//                 .attr("y", 20)
//                 .attr("width", 250)
//                 .attr("height", 50)
//                 .attr("fill", "green")

// let line = svgCanvas.append("line")
//                 .attr("x1", 500)
//                 .attr("y1", 20)
//                 .attr("x2", 400)
//                 .attr("y2", 390)
//                 .attr("stroke", "#009999")
//                 .attr("stroke-width", 2)