import { Component, OnInit } from '@angular/core'; 
import { DataService } from '../data.service';

import * as d3 from 'd3';
import * as d3Scale from 'd3-scale';

import Map from 'ol/Map';
import Tile from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import View from 'ol/View';
import Feature from 'ol/Feature';
import sVector from 'ol/source/Vector';
import lVector from 'ol/layer/Vector';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj.js';
import TopoJSON from 'ol/format/TopoJSON.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import TileJSON from 'ol/source/TileJSON';
import VectorSource from 'ol/source/Vector';
import {Icon, Style} from 'ol/style';

import * as MAPBOX_CONFIG from '../../assets/json/mapbox_config.json';

export class ConstitDataFields {
  constructor(
    code_ons: string,
    constit: string,
    region: string,
    mp_img: string,
    mp_name: string,
    electorate_size: string, 
    votes: string,
    status: string,
    win: string,
    swing: string,
    year: string,
    con: string,
    lab: string,
    lib: string,
    grn: string,
    dup: string,
    sf: string,
    snp: string,
    ukip: string,
    uup: string,
    others: string) {}
}

@Component({
  selector: 'app-d3map',
  templateUrl: './d3map.component.html',
  styleUrls: ['./d3map.component.scss']
})
export class D3mapComponent implements OnInit {  
  map; 
  vectorSource;
  vectorLayer;
  topoJSONLayer;
  rasterLayer; 
  key: any;
  constit: ConstitDataFields = "";
  constitData = [];
  chosenColour: any;
  winnerColourWheel: any;

  constructor(private data: DataService) {}

  ngOnInit() {  
    this.key = MAPBOX_CONFIG["MAPBOX_CONFIG"];
    this.initilizeMap();
  }

  initilizeMap() { 
  
    this.rasterLayer = new TileLayer({
      source: new TileJSON({
        url: 'https://api.tiles.mapbox.com/v4/mapbox.geography-class.json?secure&access_token=' + this.key,
        crossOrigin: ''
      })
    }); 

    this.topoJSONLayer = new VectorLayer({
      source: new VectorSource({
        url: 'assets/json/map.json',
        format: new TopoJSON({ 
          layers: ['subunits']
        }),
        overlaps: false
      })
    });

    this.map = new Map({
      target: 'map',
      layers: [ this.rasterLayer, this.topoJSONLayer ],
      view: new View({
        center: fromLonLat([-1.32583, 53.04172]),
        zoom: 7
      })
    });

    this.map.on('pointermove', (browserEvent) => {  
      let coordinate = browserEvent.coordinate; 
      let pixel = this.map.getPixelFromCoordinate(coordinate);  

      let constit_id = this.map.forEachFeatureAtPixel(pixel, function(this, feature) {
        return feature.get('id') - 1;
      }); 

      this.updateConstitData(constit_id);  

      if(this.constitData[0] != undefined){
        this.winnerColourWheel = this.getWinnerColourWheel();
        this.chosenColour = this.getChosenColour();
        this.createBarChart();
      }
    });
  } 

  getWinnerColourWheel(){
    let colorWheel;

    switch (this.constitData[0]["win"]) {
      case "con":
        colorWheel = "#0382AB";
        break;
      case "lab":
        colorWheel = "#DA1502";
        break;
      case "ukip":
        colorWheel = "#722889";
        break;
      case "lib":
        colorWheel = "#FDB218";
        break;
      case "grn":
        colorWheel = "#7AB630";
        break;
      case "plc":
        colorWheel = "#3C862D";
        break;
      case "snp":
        colorWheel = "#F0DE4C";
        break;
      case "dup":
        colorWheel = "#FF9900";
        break;
      case "snf":
        colorWheel = "#7AB630";
        break;
      case "other":
        colorWheel = "gray";
        break; 
    }

    return colorWheel;
  }

  getChosenColour(){
    let chosenColour = 0; 

    switch (this.constitData[0]["win"]) {
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

    return chosenColour;
  }

  createBarChart(){
    // Barchart
    var barchart = d3.select("#barChart")
    .append("div")
    .attr("class", "charty")
    .style("opacity", 1)
    .style("height", 0);

    //Width and height of barchart
    var w = 260,
      h = 200,
      barPadding = 1;

    //Create bar chart
    var barsvg = barchart
      .append("svg:svg")
      .attr("width", w)
      .attr("height", h)
      .attr('viewBox', '0 0 ' + w + ' ' + h)
      .attr('perserveAspectRatio', 'xMinYMid')
      .attr('id', "sizer-result")
      .attr('class', "sizer");

      var partyData = [{
        "party": "CON",
        "result": parseInt(this.constitData[0]["con"])
      }, {
        "party": "LAB",
        "result": parseInt(this.constitData[0]["lab"])
      }, {
        "party": "LIB",
        "result": parseInt(this.constitData[0]["lib"])
      }, {
        "party": "UKIP",
        "result": parseInt(this.constitData[0]["ukip"])
      }, {
        "party": "GREEN",
        "result": parseInt(this.constitData[0]["grn"])
      }];

      //region parties

      let whatregion = this.constitData[0]["region"];

      switch (whatregion) { 
        case "Scotland":
          partyData.push({
            "party": "SNP",
            "result": parseInt(this.constitData[0]["snp"])
          });
          break;
        case "Northern Ireland":
          partyData.push({
            "party": "DUP",
            "result": parseInt(this.constitData[0]["dup"])
          });
          partyData.push({
            "party": "UUP",
            "result": parseInt(this.constitData[0]["uup"])
          });
          partyData.push({
            "party": "SF",
            "result": parseInt(this.constitData[0]["sf"])
          });
          break;
      }

      //State data puts PlaidC in "others"
      if(whatregion=="Wales"){
        partyData.push({
          "party": "OTHER(S), e.g. Plaid",
          "result": parseInt(this.constitData[0]["others"])
        });
      }else{   
        partyData.push({
          "party": "OTHER(S)",
          "result": parseInt(this.constitData[0]["others"])
        });
      } 

      var SortByResult = function(x, y) {
        return y.result - x.result;
      }; 

      var max = d3.max(partyData, function(d) {
        return d.result;
      });

      var barx = d3Scale.scaleLinear().domain([0, max]).range([0, 160]);

      var winner = this.chosenColour;

      barsvg.attr("width", w).attr("height", h).selectAll("rect")
        .data(partyData.sort(SortByResult).filter(function(d) {
          return d.result !== 0;
        }))
        .enter()
        .append("rect")
        .attr("x", 100)
        .attr("y", function(d, i) {
          return i * (h / partyData.length);
        })
        .attr("width", function(d, i) {
          return barx(d.result);
        })
        .attr("height", h / partyData.length - barPadding)
        .attr("class", function(d, i) {
          if (i < 1) {
            return "f//" + winner;
          } else {
            return "lightbar";
          }
        });

      barsvg.selectAll("text")
        .data(partyData.sort(SortByResult).filter(function(d) {
          return d.result !== 0;
        }))
        .enter()
        .append("text")
        .text(function(d) {
          return d.party + ": " + d.result;
        })
        .attr("text-anchor", "left")
        .attr("x", function(d) {
          return 1;
        })
        .attr("y", function(d, i) {
          return i * (h / partyData.length - barPadding) + 20;
        })
        .attr("font-family", "Arial, Helvetica, sans-serif")
        .attr("font-size", "12px")
        .attr("fill", "black");
}

  updateConstitData(constit_id) { 

    this.data.getConstitData(constit_id).subscribe(
      (res: ConstitDataFields[]) => { 
        this.constitData = [];
        if(res!==[]){ 
          this.constitData.push(res);  
        }
      },
      (err) => {
        //this.error = err; 
      }
    );
    return this.constitData;
  } 

}