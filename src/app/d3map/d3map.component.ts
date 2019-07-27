import { Component, OnInit } from '@angular/core';
//import * as d3 from 'd3';
import * as d3 from 'd3-selection';
import * as d3Geo from 'd3-geo';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import * as d3Queue from 'd3-queue';
import * as d3Zoom from 'd3-zoom';

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
 zoom = d3Zoom.zoom()
    .scaleExtent([1, 10])
    .on("zoom", this.zoomed); 

  // set up SVG, viewport and clipping mask for map
  svg = d3.select('#electionMap')
    .append('svg:svg')
    .attr('width', this.width)
    .attr('height', this.height)
    .attr('viewBox', '0 0 ' + this.width + ' ' + this.height)
    .attr('perserveAspectRatio', 'xMinYMid')
    .attr('id', "sizer-map")
    .attr('class', "sizer")
    .call(this.zoom);
  
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
  /* a = d3Queue.queue.
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

      let error;
      let uk;
      let boundaries_two;
      let boundaries;
      let bes = this.bes;
      let signatures; 

      this.mapFeatures = topojson.feature(this.uk, this.uk.objects.subunits).features;

      let map = this.mapContainer.append("g").attr("class", "subunits").selectAll("path").data(this.mapFeatures);
      let constituency_two = boundaries_two,
        constituency = boundaries.data, 
        signature_data = signatures.data.attributes,
        petition = signatures.data.attributes.signatures_by_constituency,
        legend,
        content,
        content_two,
        conservativesCount = 0,
        labourCount = 0,
        ukipCount = 0,
        libCount = 0,
        greenCount = 0,
        plaidCount = 0,
        snpCount = 0,
        dupCount = 0,
        otherCount = 0,
        notCounted = 0;
  
      let colorWheel = {};
      colorWheel["con"] = "#0382AB";
      colorWheel["lab"] = "#DA1502";
      colorWheel["ukip"] = "#722889";
      colorWheel["lib"] = "#FDB218";
      colorWheel["grn"] = "#7AB630";
      colorWheel["plaid"] = "#3C862D";
      colorWheel["snp"] = "#F0DE4C";
      colorWheel["dup"] = "#FF9900";
      colorWheel["other"] = "gray";
  
      let colorWheelNumber = {};
      colorWheel["grn"] = 0;
      colorWheel["lab"] = 1;
      colorWheel["con"] = 2;
      colorWheel["snp"] = 3;
      colorWheel["plaid"] = 4;
      colorWheel["lib"] = 5;
      colorWheel["ukip"] = 9;
      colorWheel["dup"] = 10;
      colorWheel["other"] = 11;
      
      map.enter()
      .append("path")
      .attr("class", function(d, i) {

        let badge = "f0";
                      
        if (typeof constituency_two[d.properties.id - 1] === "undefined" || typeof constituency_two[d.properties.id] === "undefined") {
               
              badge = "f2";
            } else {

              if (constituency_two[d.properties.id - 1].id === "108") {
                 
                badge = "f2";
              } else 
              if (constituency_two[d.properties.id - 1].id === "650") {
                badge = "f2";
              } else {

                let chosenColour; 
                switch (constituency_two[d.properties.id].win) {
                    case "grn":
                      chosenColour = 0;
                      break;
                    case "lab":
                      chosenColour = 1;
                      break;
                    case "con":
                      chosenColour = 2;
                      break;
                    case "snp":
                      chosenColour = 3;
                      break;
                    case "plc":
                      chosenColour = 4;
                      break;
                    case "lib":
                      chosenColour = 5;
                      break;
                    case "ukip":
                      chosenColour = 9;
                      break;
                    case "dup":
                      chosenColour = 10;
                      break;
                    case "other":
                      chosenColour = 11;
                      break;
                }

                //constituency is the press id, election results/colour and region name etc
                //d is the polygons, press id, and constituency name
 
                badge = "f2"; 
              }

          } 
          return "ward ward-" + d.properties.id + " " + badge;
      })
      .attr("d", this.path);  //path of id higher by 1 gets assigned to correct colour

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
