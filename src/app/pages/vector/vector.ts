
// 绘制矢量图
import { Component, OnInit } from '@angular/core';

import Map from 'ol/Map';
import TileWMS from 'ol/source/TileWMS';
import View from 'ol/View';
import Projection from 'ol/proj/Projection';
import MousePosition from 'ol/control/MousePosition'; // 实时显示地图坐标信息
import { Control, defaults as defaultControls } from 'ol/control';
import { createStringXY } from 'ol/coordinate';
import {
  Circle as CircleStyle,
  Fill,
  Stroke,
  Style,
  Circle,
  Text,
} from 'ol/style';
import {
  Tile as TileLayer,
  Vector as VectorLayer,
  Image as ImageLayer,
} from 'ol/layer';
import { Draw, Snap } from 'ol/interaction';
import Feature from 'ol/Feature';
import Polygon from 'ol/geom/Polygon';
import { OSM, Vector as VectorSource } from 'ol/source';

import Modify from 'ol/interaction/Modify'; // 修改
import Select from 'ol/interaction/Select';

@Component({
  selector: 'vector',
  templateUrl: './vector.html',
  styleUrls: ['./vector.scss'],
})
export class VectorComponent implements OnInit {
  map: any;
  selectVal: any;
  shape: any;
  polygonLayer: any;
  shaperLayer: any;
  shapeSource: any;
  snap: any;
  layerObj: any;
  constructor() {}
  ngOnInit(): void {
    this.loadTif();
    this.drawLayer();
    console.log(this.selectVal)
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
    let extent=[
      -12237.099709491818,
      -12334.06116621488,
      46910.17340049184,
      44600.422150978695,
    ]; // 地图视图的初始范围
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
    this.map = new Map({
      controls: defaultControls().extend([mousePositionControl]),
      layers: [this.layerObj],
      target: 'map',
      view: new View({
        projection: projection
      }),
    });
    this.map.getView().fit(extent, this.map.getSize()); 
  }
  //   绘制图层
  drawLayer() {
    this.shapeSource = new VectorSource();
    this.shaperLayer = new VectorLayer({
      source: this.shapeSource,
      /*图形绘制好时最终呈现的样式,显示在地图上的最终图形*/
      style: new Style({
        fill: new Fill({
          color: 'rgba(255, 0, 0, 0.2)',
        }),
        stroke: new Stroke({
          color: 'red',
          width: 2,
        }),
        image: new Circle({
          radius: 7,
          fill: new Fill({
            color: 'red',
          }),
        }),
      }),
    });
    this.map.addLayer(this.shaperLayer);
  }
  change(params) {
      console.log(params)
    this.map.removeInteraction(this.shape);
    this.map.removeInteraction(this.snap);
    console.log(this.shaperLayer);
    if (!this.shaperLayer) {
      this.drawLayer();
    }
    this.shape = new Draw({
      type: params,
      source: this.shapeSource,
      style: new Style({
        //设置绘制时的样式
        image: new Circle({
          fill: new Fill({
            color: 'rgba(255, 0, 0, 0.2)',
          }),
          stroke: new Stroke({
            color: 'orange',
            width: 2,
          }),
          radius: 5,
        }),
        stroke: new Stroke({
          color: 'orange',
          width: 2,
        }),
        fill: new Fill({
          color: 'rgba(255, 0, 0, 0.2)',
        }),
      }),
      // maxPoints: 5,
    });
    this.shape.on('drawend', (e) => {
      // 绘制结束时暂存绘制的feature
      const geometry = e.feature.getGeometry();
      const corrdinates = geometry.getCoordinates(); // 获取绘制坐标
      console.log(corrdinates);
    });
    this.snap = new Snap({
      //  snap interaction - 鼠标捕捉 捕捉吸附snap
      source: this.shapeSource,
    });
    this.map.addInteraction(this.shape);
    this.map.addInteraction(this.snap);
  }
  //   绘制图形
  drawShapeBycoor() {
    let coor = [
      [
        [1315.9967205922107, 713.3611439305892],
        [2620.2035157080304, 646.4787441810599],
        [2209.354488675208, 140.08343179176745],
        [1294.214026589526, -5.9094331743281145],
        [1255.995512446938, 381.05302251937655],
        [1315.9967205922107, 713.3611439305892],
      ],
    ];
    var routeFeature = new Feature({
      type: 'Polygon',
      geometry: new Polygon(coor), //多边形
      name: 'test',
    });
    let style = new Style({
      fill: new Fill({
        color: 'rgba(200,200,200,0.5)',
      }),
      stroke: new Stroke({
        color: 'red',
        width: 2,
      }),
      image: new Circle({
        radius: 7,
        fill: new Fill({
          color: 'red',
        }),
      }),
      text: new Text({
        //对齐方式
        textAlign: 'center',
        //文本基线
        textBaseline: 'middle',
        //字体样式
        font: 'normal 14px 微软雅黑',
        //文本内容
        text: routeFeature.get('name'),
      }),
    });
    var vectorSource = new VectorSource({
      // 矢量图层的数据源
      features: [routeFeature],
    });
    this.polygonLayer = new VectorLayer({
      // 渲染矢量数据
      source: vectorSource,
      style: style,
    });
    this.map.addLayer(this.polygonLayer); // 添加到地图
  }
  modify() {
    if (this.shape) {
      let select = new Select();
      this.map.addInteraction(this.shape);
      let modify = new Modify({
        features: select.getFeatures(), //选中的要素集
      });
    }
  }
  clear() {
    if (this.shaperLayer) {
      this.shaperLayer.getSource().clear();
        this.map.removeInteraction(this.shape);
        this.map.removeInteraction(this.snap);
        this.selectVal = null;
    }
  }
}
