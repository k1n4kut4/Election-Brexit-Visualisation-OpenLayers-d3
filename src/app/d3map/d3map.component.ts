import { Component, OnInit } from '@angular/core'; 
import { Router } from "@angular/router"
import { ActivatedRoute } from '@angular/router';
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
import {Icon, Style, Stroke, Fill} from 'ol/style';

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
    others: string,
    signature_count: any,
    abstained: any) {}
}

@Component({
  selector: 'app-d3map',
  templateUrl: './d3map.component.html',
  styleUrls: ['./d3map.component.scss']
})
export class D3mapComponent implements OnInit {  
  dataset: any;
  datatype: any;
  datasetCapitalised: any;
  datatypeCapitalised: any;
  map; 
  barData;
  vectorSource;
  vectorLayer;
  topoJSONLayer;
  rasterLayer; 
  key: any;
  constit: ConstitDataFields = "";
  constitData = []; 
  winnerColourWheel: any;

  constructor(private router: Router, private route: ActivatedRoute, private data: DataService) {}

  ngOnInit() {  
    this.datatype = this.route.snapshot.paramMap.get('datatype'); 
    this.dataset = this.route.snapshot.paramMap.get('dataset'); 
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
      }),
      style: function(feature) {
          let id = feature.get('id');
          console.log(id);
          return new Style({
              stroke: new Stroke({
                  color: '#09a7ee',
                  width: 1
              }),
              fill: new Fill({
                  color: '#fff',
                  width: 1
              })
          });
      }
    });

    this.map = new Map({
      target: 'map',
      layers: [ this.rasterLayer, this.topoJSONLayer ],
      view: new View({
        center: fromLonLat([-1.32583, 53.04172]),
        zoom: 7
      })
    });

    this.datatypeCapitalised = this.capitaliseFirstLetter(this.datatype); 
    this.datasetCapitalised = this.capitaliseFirstLetter(this.dataset);

    this.map.on('pointermove', (browserEvent) => {  
      let coordinate = browserEvent.coordinate; 
      let pixel = this.map.getPixelFromCoordinate(coordinate);  

      let constit_id = this.map.forEachFeatureAtPixel(pixel, function(this, feature) {
        return feature.get('id') - 1;
      });  

      if(constit_id!=undefined){
        this.updateConstitData(constit_id, this.datatype, this.dataset);   
      }
      
      if(this.constitData[0] != undefined){
        this.winnerColourWheel = this.getColourWheel(this.constitData[0]["win"]); 
        this.createBarChart(this.datatype);
      }
    });

    this.map.on('click', (browserEvent) => {  
      let coordinate = browserEvent.coordinate; 
      let pixel = this.map.getPixelFromCoordinate(coordinate);  

      let constit_id = this.map.forEachFeatureAtPixel(pixel, function(this, feature) {
        return feature.get('id') - 1;
      });  

      if(constit_id!=undefined){ 
        //actual route to be /mp/profile/:id
        this.router.navigate(['/map/election', constit_id]);
      }

    });
  } 

  capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  getColourWheel(party){
    let colorWheel;

    switch (party) {
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
      case "oth":
        colorWheel = "gray";
        break; 
      case "petition":
        colorWheel = "#7AB630";
        break;
      case "abstainees":
        colorWheel = "#DA1502";
        break;
    }

    return colorWheel;
  }

  createBarChart(datatype){ 

    if(datatype=="election"){

      let electorate_size = parseInt(this.constitData[0]["electorate_size"]);

      var partyData = [{
        "party": "CON",
        "result": parseInt(this.constitData[0]["con"]),
        "colour": this.getColourWheel("con"),
        "y": 25,
        "width": 200 * (parseInt(this.constitData[0]["con"]) / electorate_size ) 
      }, {
        "party": "LAB",
        "result": parseInt(this.constitData[0]["lab"]),
        "colour": this.getColourWheel("lab"),
        "y": 50,
        "width": 200 * (parseInt(this.constitData[0]["lab"]) / electorate_size ) 
      }, {
        "party": "LIB",
        "result": parseInt(this.constitData[0]["lib"]),
        "colour": this.getColourWheel("lib"),
        "y": 75,
        "width": 200 * (parseInt(this.constitData[0]["lib"]) / electorate_size ) 
      }, {
        "party": "UKIP",
        "result": parseInt(this.constitData[0]["ukip"]),
        "colour": this.getColourWheel("ukip"),
        "y": 100,
        "width": 200 * (parseInt(this.constitData[0]["ukip"]) / electorate_size ) 
      }, {
        "party": "GREEN",
        "result": parseInt(this.constitData[0]["grn"]),
        "colour": this.getColourWheel("grn"),
        "y": 125,
        "width": 200 * (parseInt(this.constitData[0]["grn"]) / electorate_size ) 
      }];

      //region parties

      let whatregion = this.constitData[0]["region"];
      let finalBarY = 150;

      switch (whatregion) { 
        case "Scotland":
          partyData.push({
            "party": "SNP",
            "result": parseInt(this.constitData[0]["snp"]),
            "colour": this.getColourWheel("snp"),
            "y": 150,
            "width": 200 * (parseInt(this.constitData[0]["snp"]) / electorate_size ) 
          });
          finalBarY = 175;
          break;
        case "Northern Ireland":
          partyData.push({
            "party": "DUP",
            "result": parseInt(this.constitData[0]["dup"]),
            "colour": this.getColourWheel("dup"),
            "y": 150,
            "width": 200 * (parseInt(this.constitData[0]["dup"]) / electorate_size ) 
          });
          partyData.push({
            "party": "UUP",
            "result": parseInt(this.constitData[0]["uup"]),
            "colour": this.getColourWheel("uup"),
            "y": 175,
            "width": 200 * (parseInt(this.constitData[0]["uup"]) / electorate_size ) 
          });
          partyData.push({
            "party": "SF",
            "result": parseInt(this.constitData[0]["sf"]),
            "colour": this.getColourWheel("snf"),
            "y": 200,
            "width": 200 * (parseInt(this.constitData[0]["snf"]) / electorate_size ) 
          });
          finalBarY = 255;
          break;
      }

      //State data puts PlaidC in "others"
      if(whatregion=="Wales"){
        partyData.push({
          "party": "OTHER(S), e.g. Plaid",
          "result": parseInt(this.constitData[0]["others"]),
          "colour": this.getColourWheel("plc"),
          "y": 150,
          "width": 200 * (parseInt(this.constitData[0]["plc"]) / electorate_size ) 
        });
        finalBarY = 175;
      }else{   
        partyData.push({
          "party": "OTHER(S)",
          "result": parseInt(this.constitData[0]["others"]),
          "colour": this.getColourWheel("oth"),
          "y": finalBarY,
          "width": 200 * (parseInt(this.constitData[0]["oth"]) / electorate_size ) 
        });
      } 
      
    }else if(datatype=="petition"){

      let widthSignatures = 200 * (parseInt(this.constitData[0]["signature_count"]) / parseInt(this.constitData[0]["electorate_size"]));
      let widthAbstainees = 200 * (parseInt(this.constitData[0]["abstained"]) / parseInt(this.constitData[0]["electorate_size"]));

      var partyData = [{
        "party": "Signatures",
        "result": parseInt(this.constitData[0]["signature_count"]),
        "colour": this.getColourWheel("petition"),
        "y": 0,
        "width":  widthSignatures
      },
      {
        "party": "Abstained",
        "result": parseInt(this.constitData[0]["abstained"]),
        "colour": this.getColourWheel("abstainees"),
        "y": 25,
        "width":  widthAbstainees
      }];

    }

    this.barData = partyData;

    var SortByResult = function(x, y) {
      return y.result - x.result;
    }; 

    // Barchart
    var barchart = d3.select("#barChart")
    .append("div")
    .attr("class", "charty")
    .style("opacity", 1)
    .style("height", 200);

    //Width and height of barchart
    var w = 260,
      h = 200;

    //Create bar chart
    var barsvg = barchart
      .append("svg:svg")
      .attr("width", w)
      .attr("height", h)
      .attr('viewBox', '0 0 ' + w + ' ' + h)
      .attr('perserveAspectRatio', 'xMinYMid')
      .attr('id', "sizer-result")
      .attr('class', "sizer"); 
    
    barsvg.attr("width", w).attr("height", h)
    .enter()
    .attr("x", 100)
    .attr("y", function(d, i) {
      return i * (h / partyData.length);
    });
  }

  updateConstitData(constit_id, datatype, dataset) { 

    this.data.getConstitData(constit_id, datatype, dataset).subscribe(
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