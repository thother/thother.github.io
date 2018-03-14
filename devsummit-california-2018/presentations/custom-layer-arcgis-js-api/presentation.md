<!-- .slide: data-background="images/bg-1.png" -->

## Custom Layers and Layer Views

<br/>

### ArcGIS API for JavaScript

<br/>

<p>Yann Cabon, ESRI Redlands</p>
<p>Jacob Wasilkowski, ESRI St. Louis</p>
<p>Thomas Other, ESRI R&amp;D Center Z&uuml;rich</p>

---

<!-- .slide: data-background="images/bg-4.png" -->

## Topics

- Typescript
- 2D / 3D Viewing
- Tiled Layers
- Lerc Encoding
- Custom Avalanche Tile Layer
  - Extending TileLayer
  - Up-Sampling / Canvas drawing
  - Slope Calculation/Classification
  - Building App / Demo
  - Conclusion

---

<!-- .slide: data-background="images/bg-5.png" -->

### Typescript
#### Type Safety for Large Code Bases

- Superset of JavaScript
- Type existing JavaScript
- Adds lots of syntactic sugar

<div class="twos">
  <div class="snippet">
    <pre><code class="lang-ts hlts typescript">
// TypeScript

class Sphere {
  private id: number = 0;

  private diameter() {
    return 2 \* this.radius;
  }

  public static className = "Sphere";

  public radius: number = 5;

  public getIdentifier(): string {
    return \`${Sphere.className}: diameter=${this.diameter()}\`;
  }
}
    </code></pre>
  </div>
  <div class="snippet">
    <pre><code class="lang-js hljs javascript">
// JavaScript

var Sphere = (function () {
    function Sphere() {
        this.id = 0;
        this.radius = 5;
    }
    Sphere.prototype.diameter = function () {
        return 2 * this.radius;
    };
    Sphere.prototype.getIdentifier = function () {
        return Sphere.className + ": diameter=" + this.diameter();
    };
    Sphere.className = "Sphere";
    return Sphere;
}());

    </code></pre>
  </div>
</div>


---


<!-- .slide: data-background="images/bg-6.png" -->

### JavaScript API 4.x
#### _2D &amp; 3D Viewing_

<div class="twos">
  <div class="snippet">
  <pre><code class="lang-js hljs javascript">
var map = new Map({
  basemap: "streets",

  layers: [new FeatureLayer(
    "...Germany/FeatureServer/0"
  )]
});

viewLeft = new MapView({
  container: "viewDivLeft",

  map: map
});

viewRight = new SceneView({
  container: "viewDivRight",

  map: map
});

</code></pre>
  </div>
  <div class="snippet-preview">
    <iframe id="frame-2d-3d-parallel" data-src="./snippets/setup-2d-3d-parallel.html"></iframe>
  </div>
</div>

---

<!-- .slide: data-background="images/bg-5.png" -->

### Tiled Layers
#### Tiling Schemes

<div class="twos">
  <div class="snippet">
    <div>
      <br>
      <ul>
        <li>Span full globe with with<br>different levels of detail</li>
        <li>Quadratic tiles 256 x 256</li>
        <li>Width/Height prop. to 2^Level</li>
        <li>Level can go down to 15 (1 mile),<br>sometimes even to 22 (10 yards)</li>
      </ul>
    </div>
  <svg data-play-frame="frame-tiling-view" class="play-code" viewBox="0 0 24 24"><path fill="#999" d="M12,20.14C7.59,20.14 4,16.55 4,12.14C4,7.73 7.59,4.14 12,4.14C16.41,4.14 20,7.73 20,12.14C20,16.55 16.41,20.14 12,20.14M12,2.14A10,10 0 0,0 2,12.14A10,10 0 0,0 12,22.14A10,10 0 0,0 22,12.14C22,6.61 17.5,2.14 12,2.14M10,16.64L16,12.14L10,7.64V16.64Z" /></svg>
  </div>
  <div class="snippet-preview" style="height: 400px">
    <iframe id="frame-tiling-view" data-src="./snippets/setup-tiling-view.html"></iframe>
  </div>
</div>

---

<!-- .slide: data-background="images/bg-5.png" -->


### Custom Tile Layer

Let's create a custom avalanche layer that calculates slope angles on the fly.

- Use existing elevation service for sampling
- Classify slope angles according to incline:
  - Low danger: < 30 &deg; 
  - Moderate danger: 30 - 35 &deg;
  - High danger: 35 - 40 &deg;
  - Very high danger: 40 - 45 &deg;
  - Always avoid: \> 45 &deg;
- Display resulting image on top of terrain

---

<!-- .slide: data-background="images/bg-5.png" -->

### LERC Encoding
#### Limited Error Raster Compression

- LERC is an open-source image or raster format
- User defined  maximum compression error per pixel while encoding
- Elevation data published by Esri is LERC encoded
- JavaScript implementation available publicly
  - https://github.com/Esri/lerc/

---

<!-- .slide: data-background="images/bg-5.png" -->


### Custom Tile Layer
#### Extending the Base Class

<pre><code class="lang-ts hlts typescript">
// esri.core.accessorSupport
import { declared, subclass, property } from "esri/core/accessorSupport/decorators";

// esri.layers
import BaseTileLayer = require("esri/layers/BaseTileLayer");

@subclass()
class CustomTileLayer extends declared(BaseTileLayer) {

  @property({ type: String })
  url: string = null;

  @property({ type: Boolean })
  shade: boolean = false;

  @property({ type: Number })
  shadeDirection: number = 1;

  // Generate the tile url for a given level, row and column
  public getTileUrl(level: number, row: number, col: number) { ... }

  // Fetches tiles for the specified level and size.
  public fetchTile(level: number, row: number, col: number) { ... }

}

export = CustomTileLayer;

</code></pre>

---

<!-- .slide: data-background="images/bg-5.png" -->

### Custom Tile Layer
#### Up Sampling

- Reduce memory / computational load
- Use tile information from a tile with a lower resolution (higher level)

<pre><code class="lang-ts hlts typescript">
public fetchTile(level: number, row: number, col: number) {

  let uLevel = level > 2 ? level - 2 : 0;

  if (level > 16) {
    uLevel = 14;
  }

  const uRate = level - uLevel;

  const uRow = row >> uRate;
  const uCol = col >> uRate;

  const uFactor = 1 << uRate;

  // call getTileUrl() method to construct the URL to tiles
  // for a given level, row and col provided by the LayerView
  var url = this.getTileUrl(uLevel, uRow, uCol);

  return esriRequest(url, { responseType: "array-buffer" })
    .then(response => {
      ...
    });
}
</code></pre>

---

<!-- .slide: data-background="images/bg-5.png" -->

### Custom Tile Layer
#### Canvas Drawing

<div class="twos">
  <div class="snippet">
    <pre><code class="lang-ts hlts typescript">
public fetchTile(level: number, row: number, col: number) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  const width = Math.floor(this.tileInfo.size[0] / uFactor);
  const height = Math.floor(this.tileInfo.size[1] / uFactor);

  canvas.width = width;
  canvas.height = height;

  const imageData = context.createImageData(width, height);

  for (var i = 0; i < width \* height; i++) {
    var channel = Math.round(Math.random() \* 3);
    imageData.data[i \* 4] = channel % 3 === 0 ? 255 : 0;
    imageData.data[i \* 4 + 1] = channel % 3 === 1 ? 255 : 0;
    imageData.data[i \* 4 + 2] = channel % 3 === 2 ? 255 : 0;
    imageData.data[i \* 4 + 3] = 32;
  }

  context.putImageData(imageData, 0, 0);

  return canvas;
}
    </code></pre>
    <svg data-play-frame="frame-tiled-layer-random-color" class="play-code" viewBox="0 0 24 24"><path fill="#999" d="M12,20.14C7.59,20.14 4,16.55 4,12.14C4,7.73 7.59,4.14 12,4.14C16.41,4.14 20,7.73 20,12.14C20,16.55 16.41,20.14 12,20.14M12,2.14A10,10 0 0,0 2,12.14A10,10 0 0,0 12,22.14A10,10 0 0,0 22,12.14C22,6.61 17.5,2.14 12,2.14M10,16.64L16,12.14L10,7.64V16.64Z" /></svg>
  </div>
  <div class="snippet-preview">
    <iframe id="frame-tiled-layer-random-color" data-src="./snippets/setup-tiled-layer-random-color.html"></iframe>
  </div>
</div>


---

<!-- .slide: data-background="images/bg-5.png" -->

### Custom Tile Layer
#### Slope Calculation
<div class="twos">
  <div class="snippet">
    <pre><code class="lang-js hljs javascript">
const lerc = LercDecode.decode(response.data, { noDataValue: 0 });

const sLeft = Math.floor((col - uCol \* uFactor) \* width);
const sTop = Math.floor((row - uRow \* uFactor) \* height);

const kernel = [ { x: -1, y:  0 }, { x:  1, y:  0 },
                 { x:  0, y: -1 }, { x:  0, y:  1 } ];

const lengthPerPixel = 40075000 / lerc.width / (1 << uLevel) / 2;

for (let i = 0; i < width \* height; i++) {
  const x = i % width;
  const y = Math.floor(i / width);

  let sMax = -Infinity;
  let sMin = Infinity;

  for (const c of kernel) {
    const sample = lerc.pixels[sLeft + x + c.x + (sTop + y + c.y) \* lerc.width];

    sMax = Math.max(sMax, sample);
    sMin = Math.min(sMin, sample);
  }

  const slope = Math.atan((sMax - sMin) / 3 / lengthPerPixel) / Math.PI \* 180;

  data[i \* 4] = slope \* 10;
  data[i \* 4 + 1] = data[i \* 4 + 2] = 0;
  data[i \* 4 + 3] = 128;
}
    </code></pre>
    <svg data-play-frame="frame-slope-calculation" class="play-code" viewBox="0 0 24 24"><path fill="#999" d="M12,20.14C7.59,20.14 4,16.55 4,12.14C4,7.73 7.59,4.14 12,4.14C16.41,4.14 20,7.73 20,12.14C20,16.55 16.41,20.14 12,20.14M12,2.14A10,10 0 0,0 2,12.14A10,10 0 0,0 12,22.14A10,10 0 0,0 22,12.14C22,6.61 17.5,2.14 12,2.14M10,16.64L16,12.14L10,7.64V16.64Z" /></svg>
  </div>
  <div class="snippet-preview">
    <iframe id="frame-slope-calculation" data-src="./snippets/setup-slope-calculation.html"></iframe>
  </div>
</div>

---

<!-- .slide: data-background="images/bg-5.png" -->

### Custom Tile Layer
#### Slope Classification

<div class="twos">
  <div class="snippet">
    <pre><code class="lang-js hljs javascript">

slope = Math.atan((sMax - sMin) / 3 / lengthPerPixel) / Math.PI \* 180;

if (slope > 45) {
  data[i \* 4] = 172;
  data[i \* 4 + 1] = 16;
  data[i \* 4 + 2] = 64;
}
else if (slope > 40) {
  data[i \* 4] = 255;
  data[i \* 4 + 1] = 0;
  data[i \* 4 + 2] = 0;
}
else if (slope > 35) {
  data[i \* 4] = 255;
  data[i \* 4 + 1] = 128;
  data[i \* 4 + 2] = 0;
}
else if (slope > 30) {
  data[i \* 4] = 255;
  data[i \* 4 + 1] = 255;
  data[i \* 4 + 2] = 0;
}
else {
  data[i \* 4] = data[i \* 4 + 1] = data[i \* 4 + 2] = 0;
}

data[i \* 4 + 3] = slope < 30 ? 0 : 128;
    </code></pre>
    <svg data-play-frame="frame-slope-classification" class="play-code" viewBox="0 0 24 24"><path fill="#999" d="M12,20.14C7.59,20.14 4,16.55 4,12.14C4,7.73 7.59,4.14 12,4.14C16.41,4.14 20,7.73 20,12.14C20,16.55 16.41,20.14 12,20.14M12,2.14A10,10 0 0,0 2,12.14A10,10 0 0,0 12,22.14A10,10 0 0,0 22,12.14C22,6.61 17.5,2.14 12,2.14M10,16.64L16,12.14L10,7.64V16.64Z" /></svg>
  </div>
  <div class="snippet-preview">
    <iframe id="frame-slope-classification" data-src="./snippets/setup-slope-classification.html"></iframe>
  </div>
</div>

---

<!-- .slide: data-background="images/bg-5.png" -->

### Custom Tile Layer
#### Relief

<div class="twos">
  <div class="snippet">
    <pre><code class="lang-js hljs javascript">
for (let i = 0; i < width \* height; i++) {
  const x = i % width;
  const y = Math.floor(i / width);

  let sMax = -Infinity;
  let sMin = Infinity;

  const center = lerc.pixels[sLeft + x + (sTop + y) \* lerc.width];

  let shade = false;

  for (const c of kernel) {
    const sample = lerc.pixels[sLeft + x + c.x + (sTop + y + c.y) \* lerc.width];

    sMax = Math.max(sMax, sample);
    sMin = Math.min(sMin, sample);

    if (sample - center < 0 && (c.x === 1)) {
      shade = true;
    }
  }

  data[i \* 4] = 0;
  data[i \* 4 + 1] = 0;
  data[i \* 4 + 2] = 0;
  data[i \* 4 + 3] = shade ? 32 : 0;
}
    </code></pre>
    <svg data-play-frame="frame-slope-relief" class="play-code" viewBox="0 0 24 24"><path fill="#999" d="M12,20.14C7.59,20.14 4,16.55 4,12.14C4,7.73 7.59,4.14 12,4.14C16.41,4.14 20,7.73 20,12.14C20,16.55 16.41,20.14 12,20.14M12,2.14A10,10 0 0,0 2,12.14A10,10 0 0,0 12,22.14A10,10 0 0,0 22,12.14C22,6.61 17.5,2.14 12,2.14M10,16.64L16,12.14L10,7.64V16.64Z" /></svg>
  </div>
  <div class="snippet-preview">
    <iframe id="frame-slope-relief" data-src="./snippets/setup-slope-relief.html"></iframe>
  </div>
</div>


---

<!-- .slide: data-background="images/bg-5.png" -->

### Custom Tile Layer
#### Building a Custom Application

<pre><code class="lang-js hljs javascript">
require([
  "./AvalancheTileLayer.js",
  "esri/Map",
  "esri/layers/SceneLayer",
  "esri/renderers/UniqueValueRenderer"

  "dojo/domReady!"
], function(
  AvalancheTileLayer,
  Map,
  SceneLayer
) {

  var avalancheTileLayer = new AvalancheTileLayer({
    url: "//elevation3d.arcgis.com/arcgis/rest/...",
    title: "Avalanche Hazard Layer"
  });

  var map = new Map({
    basemap: "topo",
    ground: "world-elevation",
    layers: [ customTileLayer ]
  });

  var view = new SceneView({
    container: "viewDiv",
    map: map,
  });

});
</code></pre>

---

<!-- .slide: data-background="images/bg-5.png" -->

### Custom Tile Layer
#### Conclusion
<br>
Possible improvements:
- Sample more points for slope calculation
- Sample across tile boundaries
- Detect highest available level

Possible enhancements:
- Add weather information
- Add snow layering information

---

<!-- .slide: data-background="images/bg-5.png" -->

#### Slides
https://thother.github.io/devsummit-california-2018/presentations/custom-layer-arcgis-js-api
<br><br>
#### Demo
https://thother.github.io/devsummit-california-2018/demos/custom-layer

---

<!-- .slide: data-background="images/bg-final.jpg" -->

<div style="
  margin: auto auto;
  
  width: 920px;
  height: 285px;

  background-image: url(./images/esri-science-logo-white.png);
  background-size: auto 285px;
  background-blend-mode: lighten;
  background-repeat: no-repeat;
"></div>
