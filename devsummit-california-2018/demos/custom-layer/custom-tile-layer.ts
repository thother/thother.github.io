/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />

// esri
import esriRequest = require("esri/request");

// esri.core.accessorSupport
import { declared, subclass, property } from "esri/core/accessorSupport/decorators";

// esri.layers
import BaseTileLayer = require("esri/layers/BaseTileLayer");

import LercDecode = require("app/LercDecode");

@subclass("esri.layers.CustomTileLayer")
class CustomTileLayer extends declared(BaseTileLayer) {

  @property({
    type: String
  })
  url: string = null;


  @property({
    type: Boolean
  })
  shade: boolean = false;

  @property({
    type: Number
  })
  shadeDirection: number = 1;


  // generate the tile url for a given level, row and column
  public getTileUrl(level: number, row: number, col: number) {
    return this.url.replace("{z}", `${level}`).replace("{x}",
      `${col}`).replace("{y}", `${row}`);
  }

  // This method fetches tiles for the specified level and size.
  // Override this method to process the data returned from the server.
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

    // request for tiles based on the generated url
    // set allowImageDataAccess to true to allow
    // cross-domain access to create WebGL textures for 3D.
    return esriRequest(url, {
        responseType: "array-buffer"

        // responseType: "image",
        // allowImageDataAccess: true
      })
      .then(response => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        const width = Math.floor(this.tileInfo.size[0] / uFactor);
        const height = Math.floor(this.tileInfo.size[1] / uFactor);

        canvas.width = width;
        canvas.height = height;

        const lerc = LercDecode.decode(response.data, { noDataValue: 0 });
        const pixels = lerc.pixels[0];
        const stats = lerc.statistics[0];
        const noDataValue = stats.noDataValue;


        const imageData = context.createImageData(width, height);
        const data = imageData.data;

        const sLeft = Math.floor((col - uCol * uFactor) * width);
        const sTop = Math.floor((row - uRow * uFactor) * height);

        const kernel = [
          { x: -1, y:  0 },
          { x:  1, y:  0 },
          { x:  0, y: -1 },
          { x:  0, y:  1 }
        ]

        const lengthPerPixel = 40075000 / lerc.width / (1 << uLevel) / 2; //(1 << (uLevel + 1));

        let j, x, y;
        let center, sample, slope, sMax, sMin;
        let shade;

        for (var i = 0; i < width * height; i++) {
          x = i % width;
          y = Math.floor(i / width);

          if (sLeft === 0 && x === 0) {
              x = 1;
          }
          else if (sTop === 0 && y === 0) {
              y = 1;
          }

          j = sLeft + x + (sTop + y) * lerc.width;

          center = pixels[j];

          sMax = -Infinity;
          sMin = Infinity;
          shade = false;

          for (const c of kernel) {
            j = sLeft + x + c.x + (sTop + y + c.y) * lerc.width;

            if (pixels[j] === noDataValue) {
              continue;
            }

            sample = pixels[j];

            if (sample) {
              sMax = Math.max(sMax, sample);
              sMin = Math.min(sMin, sample);

              if (sample > 0 && center > 0 && sample - center < 0 && (c.x === this.shadeDirection)) {
                shade = true;
              }
            }
          }

          slope = Math.atan((sMax - sMin) / 3 / lengthPerPixel) / Math.PI * 180;

          if (slope > 45) {
            data[i * 4] = 172;
            data[i * 4 + 1] = 16;
            data[i * 4 + 2] = 64;
          }
          else if (slope > 40) {
            data[i * 4] = 255;
            data[i * 4 + 1] = 0;
            data[i * 4 + 2] = 0;
          }
          else if (slope > 35) {
            data[i * 4] = 255;
            data[i * 4 + 1] = 128;
            data[i * 4 + 2] = 0;
          }
          else if (slope > 30) {
            data[i * 4] = 255;
            data[i * 4 + 1] = 255;
            data[i * 4 + 2] = 0;
          }
          else {
            data[i * 4] = 0; //slope * 10;
            data[i * 4 + 1] = 0;
            data[i * 4 + 2] = 0;
          }

          data[i * 4 + 3] = pixels[i] === noDataValue || slope < 30 ? 0 : 128;

          if (this.shade && shade && slope < 30) {
            data[i * 4 + 3] = 32;
          }
        }

        context.putImageData(imageData, 0, 0);

        return canvas;
      });
  }



}

export = CustomTileLayer;
