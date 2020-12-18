import { Component, OnInit,  } from "@angular/core";
import Map from 'ol/Map';
import View from 'ol/View';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import Projection from 'ol/proj/Projection';
import {  Vector as VectorSource } from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON'; // 加载geojson
import Overlay from 'ol/Overlay';
import {
    Circle as CircleStyle,
    Fill,
    Stroke,
    Style,
    Circle,
    Text,
  } from 'ol/style';

@Component({
    selector: 'overlay',
    templateUrl: './overlay.html',
    styleUrls: ['./overlay.scss']
})

export class OverlayComponent implements OnInit{
    source:any;
    vectorLayer:any;
    mapObj:any;
    constructor(){}
    ngOnInit():void{
        this.source = new VectorSource({
            // url: '../../../assets/mapdata/convert.json',
            url: 'assets/mapdata/convert.json',
            format: new GeoJSON(),
          });
        this.vectorLayer = new VectorLayer({
            source: this.source,
            style: new Style({
              fill: new Fill({
                color: 'rgba(255, 255, 255, 0.2)',
              }),
              stroke: new Stroke({
                color: '#000',
                width: 2,
              }),
              image: new CircleStyle({
                radius: 7,
                fill: new Fill({
                  color: '#000',
                }),
              }),
            }),
          });
          this.mapObj = new Map({
            layers: [this.vectorLayer],
            target: 'overlayMap',
            view: new View({
              projection: 'EPSG:3857',
              center: [0, -3000],
              zoom: 12,
            }),
          });
          var self =this;
          self.addOverlay();
          this.mapObj.on('click', function (e) {
              self.addOverlay(e.coordinate)
          });
    }
    addOverlay(position?){
        position = position|| undefined
        let ele= document.getElementById('overlay-test');
        var anhor= new Overlay({
            id:'test',
            element: ele
        });
        anhor.setPosition(position);
        this.mapObj.addOverlay(anhor);
    }
}
