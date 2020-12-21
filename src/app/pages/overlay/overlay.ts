import { Component, OnInit,  } from "@angular/core";
import Map from 'ol/Map';
import View from 'ol/View';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import Projection from 'ol/proj/Projection';
import {  Vector as VectorSource } from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON'; // 加载geojson
import Overlay from 'ol/Overlay';
import TileWMS from 'ol/source/TileWMS';
import { Control, defaults as defaultControls } from 'ol/control';
import MousePosition from 'ol/control/MousePosition'; // 实时显示地图坐标信息
import { createStringXY } from 'ol/coordinate';
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
    layerObj:any;
    map:any;
    extent: any[];
    constructor(){}
    // ngOnInit(): void{}
    ngOnInit(): void{ // dom元素加载完成后展示
        this.loadTif();
        // this.addOverlay();
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
            target: 'geoMap',
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
          console.log(this.mapObj)
    }
    loadTif() {
        let tifId = 'cpy:cpy_tif2';
        let wmsUrl = 'http://localhost:6060/geoserver/cpy/wms';
    
        //地图图层对象
        this.layerObj = new TileLayer({
          // 用于显示瓦片资源
          //   title: 'maplayer',
          source: new TileWMS({
            // 切片WMS服务，多个标注
            url: wmsUrl,
            params: {
              LAYERS: tifId,
            },
          }),
        });
        this.extent =[ -10747.054660449041,
            -10624.633755101742,
            39786.85427211269,
            38134.111415960804];
        var projection = new Projection({
          code: 'EPSG:3857',
          units: 'm',
        });
        var mousePositionControl = new MousePosition({
          className: 'custom-mouse-position',
          target: document.getElementById('location'),
          coordinateFormat: createStringXY(5),
          undefinedHTML: '&nbsp;',
        });
        let view = new View({
            projection: projection,
        });
        this.map = new Map({
          controls: defaultControls().extend([mousePositionControl]),
          layers: [this.layerObj],
          target: 'overlayMap',
          view: view
        });
          //自适应地图view
          this.map.getView().fit(this.extent, this.map.getSize());  
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
    fitScreen(){
        this.map.getView().fit(this.extent, this.map.getSize());  
    }
}
