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

    this.chicago.setStyle(new Style({
      image: new Icon(({
        color: '#8959A8',
        crossOrigin: 'anonymous',
        src: 'assets/svg/vectorpoint.svg',
        imgSize: [20, 20]
      }))
    }));

    this.london = new Feature({
      geometry: new Point(fromLonLat([-0.12755, 51.507222]))
    });
  
    this.madrid = new Feature({
      geometry: new Point(fromLonLat([-3.683333, 40.4]))
    });

    this.london.setStyle(new Style({
      image: new Icon(({
        color: '#4271AE',
        crossOrigin: 'anonymous',
        src: 'assets/svg/vectorpoint.svg',
        imgSize: [20, 20]
      }))
    }));
  
    this.madrid.setStyle(new Style({
      image: new Icon(({
        color: [113, 140, 0],
        crossOrigin: 'anonymous',
        src: 'assets/png/dot.png',
        imgSize: [20, 20]
      }))
    }));
  
    this.vectorSource = new VectorSource({
      features: [this.chicago, this.madrid,this.london]
    }); 

    this.vectorLayer = new VectorLayer({
      source: this.vectorSource
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
      layers: [ this.rasterLayer, this.vectorLayer, this.topoJSONLayer ],
      view: new View({
        center: fromLonLat([-0.75583, 54.04172]),
        zoom: 6
      })
    });
  }

}