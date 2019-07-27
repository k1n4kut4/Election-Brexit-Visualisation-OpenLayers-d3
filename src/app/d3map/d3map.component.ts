import { Component, OnInit } from '@angular/core';
//import * as d3 from 'd3';
import * as d3 from 'd3-selection';
import * as d3Geo from 'd3-geo';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';

@Component({
  selector: 'app-d3map',
  templateUrl: './d3map.component.html',
  styleUrls: ['./d3map.component.scss']
})
export class D3mapComponent implements OnInit { 

  // map viewport dimensions
  width = 460;
  height = 650;

  // create a scale of colours for each party, so we can map results to constituency segments
  /* quantize = d3Scale.scaleQuantize()
    .domain([1, 11])
    .range(d3.range(11).map(function(i) {
      return "f" + i;
    })); */
  
  // set up map projection, and position it.
  projection = d3Geo.geoAlbers()
    .center([1.5, 55.2])
    .rotate([4.4, 0])
    .parallels([50, 50])
    .scale(3300)
    .translate([this.width / 2, this.height / 2]);

  path = d3Geo.geoPath().projection(this.projection);
  
  // add d3 zoom behaviour to map container.
  /* zoom = d3.behavior.zoom()
    .scaleExtent([1, 10])
    .on("zoom", this.zoomed); */

  // set up SVG, viewport and clipping mask for map
  svg = d3.select('#electionMap')
    .append('svg:svg')
    .attr('width', this.width)
    .attr('height', this.height)
    .attr('viewBox', '0 0 ' + this.width + ' ' + this.height)
    .attr('perserveAspectRatio', 'xMinYMid')
    .attr('id', "sizer-map")
    .attr('class', "sizer");
    //.call(this.zoom);
  
  main = this.svg.append("g")
    .attr('transform', 'translate(0,0)')
    .attr('width', this.width)
    .attr('height', this.height)
    .attr('class', 'main');

  rect = this.svg.append("rect")
    .attr("width", this.width)
    .attr("height", this.height)
    .attr("class", "overlay")
    .style("fill", "none")
    .style("pointer-events", "all");

  mapContainer = this.svg.append("g");
  
  tooltip = d3.select("#tooltipContainer")
    .append("div")
    .attr("class", "tooltip");
  
  // this.tooltip.html(" ");
  
  tooltip_two = d3.select("#tooltipContainer_two")
    .append("div")
    .attr("class", "tooltip");

  // this.tooltip_two.html(" ");

  totalSignatures = d3.select("#totalSignatures");
  totalSignaturesUK = d3.select("#totalSignaturesUK");

  // Barchart
  barchart = d3.select("#tooltipContainer")
    .append("div")
    .attr("class", "charty")
    .style("opacity", 0)
    .style("height", 0);

  //Width and height of barchart
  w = 260;
  h = 200;
  barPadding = 1;

  //Create bar chart
  barsvg = this.barchart
    .append("svg:svg")
    .attr("width", this.w)
    .attr("height", this.h)
    .attr('viewBox', '0 0 ' + this.w + ' ' + this.h)
    .attr('perserveAspectRatio', 'xMinYMid')
    .attr('id', "sizer-result")
    .attr('class', "sizer");

  // use queue function to load map and results data asynchronously, then call ready function when done.
  /* queue()
    .defer(d3.json, "./assets/json/map.json") //map polygons
    .defer(d3.json, "./assets/json/mp_details_full.json") //constit names and 2017 election results
    .defer(d3.json, "./assets/json/election-data.json") //constit names and 2015 election results
    .defer(d3.json, "./assets/json/constit_ons.json") //convert press assoc code to ons code
    .defer(d3.json, "./assets/json/petitions-241584.json") //petition signature counts
    .await(ready); */

  uk;
  mapFeatures;
  boundaries;
  bes;
  constituency_two;
  constituency;
  signature_data;
  petition;

  constructor() { }

  ngOnInit() {
  }

  ngAfterContentInit() {
    // Select <p> element using d3 and change style..
      d3.select('p').style('color', 'red');
  }

  zoomed() {
    var t = d3.event.translate,
      s = d3.event.scale;
    t[0] = Math.min(this.width / 2 * (s - 1), Math.max(this.width / 2 * (1 - s) - 150 * s, t[0]));
    t[1] = Math.min(this.height / 2 * (s - 1) + 230 * s, Math.max(this.height / 2 * (1 - s) - 230 * s, t[1]));
    //this.zoom.translate(t);
    this.mapContainer.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");
  }

  /* radius: number=15;
  clickeventcount: number =0 ;
  svgclickhandle(event: any ) {
    this.clickeventcount+=1;
    let colorname = 'black';
  if (this.clickeventcount % 5 === 0)  {
      colorname ='red';
  } else if (this.clickeventcount % 3 === 0) {
    colorname ='yellow';
  } else if (this.clickeventcount % 2 === 0) {
    colorname ='purple';
  }
  d3.select(event.target).
    append('circle').
    attr('cx', event.x).
    attr('cy',event.y).
    attr('r',this.radius).
    attr('fill',colorname);
  } */

  

}
