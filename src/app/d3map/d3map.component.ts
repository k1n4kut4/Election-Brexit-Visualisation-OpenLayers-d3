import { Component, OnInit } from '@angular/core'; 
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
import * as ConstitData from '../../assets/json/mp_details_full.json'; 

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

  constructor() { } 

  ngOnInit() {  
    this.key = MAPBOX_CONFIG["MAPBOX_CONFIG"];
    this.initilizeMap();
    const cd = ConstitData.default;
    console.log(cd);
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
        center: fromLonLat([-0.75583, 54.04172]),
        zoom: 8
      })
    });

    this.map.on('pointermove', (browserEvent) => {  
      let coordinate = browserEvent.coordinate; 
      let pixel = this.map.getPixelFromCoordinate(coordinate); 
      let el = document.getElementById('const_details');
      el.innerHTML = 'Scroll mouse over a constituency';
      this.map.forEachFeatureAtPixel(pixel, function(feature) {
        el.innerHTML = feature.get('id') + ': ' + feature.get('name') + '';



      });
    });
  } 

}