/**
 * Created by rcifuentes on 5/2/2015.
 */
/* Initialize tooltip */
var tip = d3.tip().attr('class', 'd3-tip').html(function (d) {
    return "<strong>" + d.value + " % </strong>";
});

var width = 460,
    height = 300,
    radius = Math.min(width, height) / 2;

var color = d3.scale.category20();

var donut = d3.layout.pie().sort(null);

var arc = d3.svg.arc().innerRadius(radius - 20).outerRadius(radius - 10);

var svg = d3.select("#d3-donut-chart").append("svg")
    .attr("width", width)
    .attr("height", height);

svg.call(tip);

var total = {label: '1768 [MW]', percents: [6, 38, 29, 27]};
var carbon = {label: '324 [MW]', percents: [24, 7, 2, 18, 13, 36]};
var dataset = total;
var labels = ['SING', 'SIN', 'SEA', 'SEM'];

var arc_group = svg.append('g')
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var label_group = svg.append("g")
    .attr("class", "lblGroup")
    .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");

// GROUP FOR CENTER TEXT
var center_group = svg.append("g")
    .attr("class", "ctrGroup")
    .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");

// CENTER LABEL
var pieLabel = center_group.append("text")
    .attr("dy", ".35em").attr("class", "chartLabel")
    .attr("text-anchor", "middle")
    .text(dataset.label);

//    var path = svg.selectAll("path")
//            .data(donut(dataset.percents))
//            .enter().append("path")
//            .attr("fill", function (d, i) {
//                return color(i);
//            })
//            .attr("d", arc);


// http://jsfiddle.net/MX7JC/9/
// DRAW ARC PATHS
var arcs = arc_group.selectAll("path")
    .data(donut(dataset.percents));

arcs.enter().append("path")
//            .attr("stroke", "white")
//            .attr("stroke-width", 0.5)
    .attr("fill", function (d, i) {
        //console.log(d);
        return color(i);
    })
    .attr("d", arc)
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide);

//            .each(function(d) {this._current = d});

// DRAW SLICE LABELS
var sliceLabel = label_group.selectAll("text")
    .data(donut(dataset.percents));
sliceLabel.enter().append("text")
    .attr("class", "arcLabel")
    .attr("transform", function (d) {
        return "translate(" + arc.centroid(d) + ")";
    })
    .attr("text-anchor", "middle")
    .text(function (d, i) {
        return labels[i];
    });


