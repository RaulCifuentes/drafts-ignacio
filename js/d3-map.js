/**
 * Created by rcifuentes on 5/2/2015.
 */
//Based on http://techslides.com/demos/d3/d3-worldmap-boilerplate.html
d3.select(window).on("resize", throttle);

//    var width = document.getElementById('container').offsetWidth-60;
var height = document.getElementById('map_container').offsetHeight;
var width = document.getElementById('map_container').offsetWidth; //height / 2.2;


var zoom = d3.behavior.zoom()
    .scaleExtent([1, 8])
    .on("zoom", move);

var topo, projection, path, svg, g;

var tooltip = d3.select("#map_container").append("div").attr("class", "tooltip hidden");

setup(width, height);

//    var width = 280, height = 640;

function setup(width, height) {
    projection = d3.geo.conicEqualArea()
        .center([20, -30])
//            .center([0, 55.4])
        /*rotate http://www.d3noob.org/2013/03/a-simple-d3js-map-explained.html
         If rotation is specified, this sets the projection’s three-axis rotation to the specified angles for yaw, pitch and roll (equivalently longitude, latitude and roll) in degrees and returns the projection. If rotation is not specified, it sets the values to [0, 0, 0]. If the specified rotation has only two values, rather than three, the roll is assumed to be 0°.
         Likewise we have rotated our map by -180 degrees in longitude. This has been done specifically to place the map with the center on the anti-meridian (The international date line in the middle of the Pacific ocean). If we return the value to `[0,0]`(with our original values of `scale` and `center` this is the result.
         * */
        .rotate([60, 0])
        .parallels([-35, -65])
        .scale(300 * 3)
    //            .translate([width / 2, height / 2])
    //            .translate([0, -200)
    //    ;


    path = d3.geo.path().projection(projection);


    svg = d3.select("#map_container").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
//            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
        .call(zoom);

    g = svg.append("g");


}


d3.json("data/chile.json", function (error, topology) {
    if (error) return console.error(error);

    var regions = topojson.feature(topology, topology.objects["chile-regions"]).features;

    topo = regions;

    draw(topo);
});

function draw(topology) {
    //        svg.append("path")
//                .datum(topojson.feature(topology, topology.objects["chile-regions"]))
//                .attr("d", path);

    var region = g.selectAll(".region").data(topology);

    var color = d3.scale.category20c();

    region.enter().insert("path")
        .attr("d", path)
        .attr("id", function (d, i) {
            return d.id;
        })
        .attr("title", function (d, i) {
            return d.properties.Details;
        })
        .attr("fill", function (d, i) {
            return color(i);
        });
//                .attr("class", function (d) {
//                    return "region_" + d.properties.Region;
//                });


//            g.selectAll("path")
//                    .data()
//                    .enter().append("path")
//                    .attr("d", path)
//                    .attr("id", function (d, i) {
//                        return d.id;
//                    })
//                    .attr("title", function (d,i) {
//                        return d.properties.Details;
//                    })
//                    .attr("class", function (d) {
//                        return "region_" + d.properties.Region;
//                    });


    //ofsets plus width/height of transform, plsu 20 px of padding, plus 20 extra for tooltip offset off mouse
//            var offsetL = document.getElementById('container').offsetLeft+(width/2)+40;
    var offsetL = document.getElementById('map_container').offsetLeft + 40;
//            var offsetT =document.getElementById('container').offsetTop+(height/2)+20;
    var offsetT = document.getElementById('map_container').offsetTop + 20;

    region.on("mousemove", function (d, i) {
        var mouse = d3.mouse(svg.node()).map(function (d) {
            return parseInt(d);
        });
        tooltip
            .classed("hidden", false)
            .attr("style", "left:" + (mouse[0] + offsetL) + "px;top:" + (mouse[1] + offsetT) + "px")
            .html(d.properties.Details)
    })
        .on("mouseout", function (d, i) {
            tooltip.classed("hidden", true)
        });


    var marks = [{long: -73, lat: -40}, {long: -71, lat: -35}, {long: -70, lat: -20}];

    svg.selectAll(".mark")
        .data(marks)
        .enter()
        .append("image")
        .attr('class', 'mark')
        .attr('onclick', 'alert("Hola")')
        .attr('width', 20)
        .attr('height', 20)
        .attr("xlink:href", 'resources/11-32.png')
        .attr("transform", function (d) {
            return "translate(" + projection([d.long, d.lat]) + ")";
        });

}
//        svg.selectAll(".subunit")
//                .data(topojson.feature(uk, uk.objects.subunits).features)
//                .enter().append("path")
//                .attr("class", function(d) { return "subunit " + d.id; })
//                .attr("d", path);


function redraw() {
    width = document.getElementById('map_container').offsetWidth - 60;
    height = width / 2;
    d3.select('svg').remove();
    setup(width, height);
    draw(topo);
}


function move() {

    var t = d3.event.translate;
    var s = d3.event.scale;
    var h = height / 3;

    t[0] = Math.min(width / 2 * (s - 1), Math.max(width / 2 * (1 - s), t[0]));
    t[1] = Math.min(height / 2 * (s - 1) + h * s, Math.max(height / 2 * (1 - s) - h * s, t[1]));

    zoom.translate(t);
    g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");

}

//
//    function move() {
//        var t = d3.event.translate;
//        var s = d3.event.scale;
//        t[0] = Math.min(width / 2 * (s - 1), Math.max(width / 2 * (1 - s), t[0]));
//        t[1] = Math.min(height / 2 * (s - 1) + 230 * s, Math.max(height / 2 * (1 - s) - 230 * s, t[1]));
//        zoom.translate(t);
//        g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");
//    }


var throttleTimer;
function throttle() {
    window.clearTimeout(throttleTimer);
    throttleTimer = window.setTimeout(function () {
        redraw();
    }, 200);
}

//        function zoom() {
//            g.attr("transform", "translate("
//            + d3.event.translate
//            + ")scale(" + d3.event.scale + ")");
//        }
