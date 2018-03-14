/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />
define(["require", "exports", "esri/core/tsSupport/declareExtendsHelper", "esri/core/tsSupport/decorateHelper", "esri/request", "esri/core/accessorSupport/decorators", "esri/layers/BaseTileLayer", "app/LercDecode"], function (require, exports, __extends, __decorate, esriRequest, decorators_1, BaseTileLayer, LercDecode) {
    var CustomTileLayer = (function (_super) {
        __extends(CustomTileLayer, _super);
        function CustomTileLayer() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.url = null;
            _this.shade = false;
            _this.shadeDirection = 1;
            return _this;
        }
        // generate the tile url for a given level, row and column
        CustomTileLayer.prototype.getTileUrl = function (level, row, col) {
            return this.url.replace("{z}", "" + level).replace("{x}", "" + col).replace("{y}", "" + row);
        };
        // This method fetches tiles for the specified level and size.
        // Override this method to process the data returned from the server.
        CustomTileLayer.prototype.fetchTile = function (level, row, col) {
            var _this = this;
            var uLevel = level > 2 ? level - 2 : 0;
            if (level > 16) {
                uLevel = 14;
            }
            var uRate = level - uLevel;
            var uRow = row >> uRate;
            var uCol = col >> uRate;
            var uFactor = 1 << uRate;
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
                .then(function (response) {
                var canvas = document.createElement("canvas");
                var context = canvas.getContext("2d");
                var width = Math.floor(_this.tileInfo.size[0] / uFactor);
                var height = Math.floor(_this.tileInfo.size[1] / uFactor);
                canvas.width = width;
                canvas.height = height;
                var lerc = LercDecode.decode(response.data, { noDataValue: 0 });
                var pixels = lerc.pixels[0];
                var stats = lerc.statistics[0];
                var noDataValue = stats.noDataValue;
                var imageData = context.createImageData(width, height);
                var data = imageData.data;
                var sLeft = Math.floor((col - uCol * uFactor) * width);
                var sTop = Math.floor((row - uRow * uFactor) * height);
                var kernel = [
                    { x: -1, y: 0 },
                    { x: 1, y: 0 },
                    { x: 0, y: -1 },
                    { x: 0, y: 1 }
                ];
                var lengthPerPixel = 40075000 / lerc.width / (1 << uLevel) / 2; //(1 << (uLevel + 1));
                var j, x, y;
                var center, sample, slope, sMax, sMin;
                var shade;
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
                    for (var _i = 0, kernel_1 = kernel; _i < kernel_1.length; _i++) {
                        var c = kernel_1[_i];
                        j = sLeft + x + c.x + (sTop + y + c.y) * lerc.width;
                        if (pixels[j] === noDataValue) {
                            continue;
                        }
                        sample = pixels[j];
                        if (sample) {
                            sMax = Math.max(sMax, sample);
                            sMin = Math.min(sMin, sample);
                            if (sample > 0 && center > 0 && sample - center < 0 && (c.x === _this.shadeDirection)) {
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
                    if (_this.shade && shade && slope < 30) {
                        data[i * 4 + 3] = 32;
                    }
                }
                context.putImageData(imageData, 0, 0);
                return canvas;
            });
        };
        __decorate([
            decorators_1.property({
                type: String
            })
        ], CustomTileLayer.prototype, "url", void 0);
        __decorate([
            decorators_1.property({
                type: Boolean
            })
        ], CustomTileLayer.prototype, "shade", void 0);
        __decorate([
            decorators_1.property({
                type: Number
            })
        ], CustomTileLayer.prototype, "shadeDirection", void 0);
        CustomTileLayer = __decorate([
            decorators_1.subclass("esri.layers.CustomTileLayer")
        ], CustomTileLayer);
        return CustomTileLayer;
    }(decorators_1.declared(BaseTileLayer)));
    return CustomTileLayer;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VzdG9tLXRpbGUtbGF5ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjdXN0b20tdGlsZS1sYXllci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSx1RkFBdUY7QUFDdkYsa0ZBQWtGOztJQWNsRjtRQUE4QixtQ0FBdUI7UUFEckQ7WUFBQSxxRUE2S0M7WUF2S0MsU0FBRyxHQUFXLElBQUksQ0FBQztZQU1uQixXQUFLLEdBQVksS0FBSyxDQUFDO1lBS3ZCLG9CQUFjLEdBQVcsQ0FBQyxDQUFDOztRQTRKN0IsQ0FBQztRQXpKQywwREFBMEQ7UUFDbkQsb0NBQVUsR0FBakIsVUFBa0IsS0FBYSxFQUFFLEdBQVcsRUFBRSxHQUFXO1lBQ3ZELE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsS0FBRyxLQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUN0RCxLQUFHLEdBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsS0FBRyxHQUFLLENBQUMsQ0FBQztRQUN2QyxDQUFDO1FBRUQsOERBQThEO1FBQzlELHFFQUFxRTtRQUM5RCxtQ0FBUyxHQUFoQixVQUFpQixLQUFhLEVBQUUsR0FBVyxFQUFFLEdBQVc7WUFBeEQsaUJBNklDO1lBMUlDLElBQUksTUFBTSxHQUFHLEtBQUssR0FBRyxDQUFDLEdBQUcsS0FBSyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7WUFFdkMsRUFBRSxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ2YsTUFBTSxHQUFHLEVBQUUsQ0FBQztZQUNkLENBQUM7WUFFRCxJQUFNLEtBQUssR0FBRyxLQUFLLEdBQUcsTUFBTSxDQUFDO1lBRTdCLElBQU0sSUFBSSxHQUFHLEdBQUcsSUFBSSxLQUFLLENBQUM7WUFDMUIsSUFBTSxJQUFJLEdBQUcsR0FBRyxJQUFJLEtBQUssQ0FBQztZQUUxQixJQUFNLE9BQU8sR0FBRyxDQUFDLElBQUks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QUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ3RCLENBQUM7b0JBQ0QsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUNwQixJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQzt3QkFDbEIsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO3dCQUN0QixJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ3RCLENBQUM7b0JBQ0QsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUNwQixJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQzt3QkFDbEIsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO3dCQUN0QixJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ3RCLENBQUM7b0JBQ0QsSUFBSSxDQUFDLENBQUM7d0JBQ0osSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxhQUFhO3dCQUM5QixJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7d0JBQ3BCLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDdEIsQ0FBQztvQkFFRCxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssV0FBVyxJQUFJLEtBQUssR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztvQkFFcEUsRUFBRSxDQUFDLENBQUMsS0FBSSxDQUFDLEtBQUssSUFBSSxLQUFLLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQ3RDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztvQkFDdkIsQ0FBQztnQkFDSCxDQUFDO2dCQUVELE9BQU8sQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFFdEMsTUFBTSxDQUFDLE1BQU0sQ0FBQztZQUNoQixDQUFDLENBQUMsQ0FBQztRQUNQLENBQUM7UUFuS0Q7WUFIQyxxQkFBUSxDQUFDO2dCQUNSLElBQUksRUFBRSxNQUFNO2FBQ2IsQ0FBQztvREFDaUI7UUFNbkI7WUFIQyxxQkFBUSxDQUFDO2dCQUNSLElBQUksRUFBRSxPQUFPO2FBQ2QsQ0FBQztzREFDcUI7UUFLdkI7WUFIQyxxQkFBUSxDQUFDO2dCQUNSLElBQUksRUFBRSxNQUFNO2FBQ2IsQ0FBQzsrREFDeUI7UUFoQnZCLGVBQWU7WUFEcEIscUJBQVEsQ0FBQyw2QkFBNkIsQ0FBQztXQUNsQyxlQUFlLENBNEtwQjtRQUFELHNCQUFDO0tBQUEsQUE1S0QsQ0FBOEIscUJBQVEsQ0FBQyxhQUFhLENBQUMsR0E0S3BEO0lBRUQsT0FBUyxlQUFlLENBQUMifQ==