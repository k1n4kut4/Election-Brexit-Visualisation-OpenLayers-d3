import { Component, OnInit } from '@angular/core'; 
import * as MAPBOX_CONFIG from '../../assets/json/MAPBOX_CONFIG.json';
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

@Component({
  selector: 'app-d3map',
  templateUrl: './d3map.component.html',
  styleUrls: ['./d3map.component.scss']
})
export class D3mapComponent implements OnInit {  
  map;
  chicago;
  vectorSource;
  vectorLayer;
  topoJSONLayer;
  rasterLayer;
  london: any;
  madrid: any;
  key: any;

  constructor() { } 

  ngOnInit() {  
    this.key = MAPBOX_CONFIG["MAPBOX_CONFIG"];
    this.initilizeMap();
  }

  initilizeMap() {

    this.chicago = new Feature({
      geometry: new Point(fromLonLat([	-87.623177, 41.881832]))
    });
  
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
          // don't want to render the full world polygon (stored as 'land' layer),
          // which repeats all countries
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
        zoom: 6
      })
    });

    this.map.on('pointermove', (browserEvent) => { 
      let coordinate = browserEvent.coordinate; 
      let pixel = this.map.getPixelFromCoordinate(coordinate); 
      let el = document.getElementById('name');
      el.innerHTML = 'Scroll mouse over a constituency';
      this.map.forEachFeatureAtPixel(pixel, function(feature) {
        el.innerHTML = feature.get('name') + '';
      });
    });
  } 

}