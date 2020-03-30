define(["require", "exports", "esri/core/accessorSupport/decorators", "esri/layers/BaseElevationLayer", "esri/layers/ElevationLayer"], function (require, exports, decorators_1, BaseElevationLayer, ElevationLayer) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var ExaggeratedElevationLayer = /** @class */ (function (_super) {
        __extends(ExaggeratedElevationLayer, _super);
        function ExaggeratedElevationLayer(properties) {
            var _this = _super.call(this) || this;
            _this.exaggeration = 200;
            _this.exaggeration = properties && properties.exaggeration;
            return _this;
        }
        ExaggeratedElevationLayer.prototype.load = function () {
            this._elevation = new ElevationLayer({
                url: "//elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer"
            });
            // wait for the elevation layer to load before resolving load()
            return this.addResolvingPromise(this._elevation.load());
        };
        // Fetches the tile(s) visible in the view
        ExaggeratedElevationLayer.prototype.fetchTile = function (level, row, col, options) {
            return __awaiter(this, void 0, void 0, function () {
                var data, exaggeration, i;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._elevation.fetchTile(level, row, col, options)];
                        case 1:
                            data = _a.sent();
                            exaggeration = this.exaggeration;
                            for (i = 0; i < data.values.length; i++) {
                                // each value represents an elevation sample for the
                                // given pixel position in the tile. Multiply this
                                // by the exaggeration value
                                data.values[i] = data.values[i] * exaggeration;
                            }
                            return [2 /*return*/, data];
                    }
                });
            });
        };
        __decorate([
            decorators_1.property()
        ], ExaggeratedElevationLayer.prototype, "exaggeration", void 0);
        ExaggeratedElevationLayer = __decorate([
            decorators_1.subclass("esri.layers.BaseElevationLayer")
        ], ExaggeratedElevationLayer);
        return ExaggeratedElevationLayer;
    }(decorators_1.declared(BaseElevationLayer)));
    exports.ExaggeratedElevationLayer = ExaggeratedElevationLayer;
});
