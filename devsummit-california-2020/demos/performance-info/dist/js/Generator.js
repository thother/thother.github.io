define(["require", "exports", "esri/core/accessorSupport/decorators", "esri/widgets/Widget", "esri/widgets/support/widget", "esri/Graphic", "esri/geometry/Point"], function (require, exports, decorators_1, Widget, widget_1, Graphic, Point) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var Generator = /** @class */ (function (_super) {
        __extends(Generator, _super);
        //--------------------------------------------------------------------------
        //
        //  Lifecycle
        //
        //--------------------------------------------------------------------------
        function Generator(properties) {
            var _this = _super.call(this) || this;
            //--------------------------------------------------------------------------
            //
            //  Properties
            //
            //--------------------------------------------------------------------------
            _this.graphicsLayer = null;
            _this.resources = null;
            _this.cb = null;
            //--------------------------------------------------------------------------
            //
            //  Private Methods
            //
            //--------------------------------------------------------------------------
            _this.targetY = 0;
            _this.currentY = 0;
            _this.combinedElementsHeight = 0;
            _this.firstElementHeight = 0;
            return _this;
        }
        //--------------------------------------------------------------------------
        //
        //  Public Methods
        //
        //--------------------------------------------------------------------------
        Generator.prototype.render = function () {
            var _this = this;
            if (!this.resources || !this.resources.length) {
                console.error("No resources defined");
                return;
            }
            var itemIndices = this.resources.map(function (_, index) { return index; });
            // wrap around
            itemIndices.push(itemIndices[0], itemIndices[1]);
            var onclick = function () {
                _this.startAnimation();
            };
            return (widget_1.tsx("div", { id: "resourceGenerator", onclick: onclick },
                widget_1.tsx("table", null, itemIndices.map(function (index) { return _this.renderResource(_this.resources[index]); }))));
        };
        Generator.prototype.renderResource = function (resource) {
            var onload = function (event) {
                if (!resource.icon.height) {
                    resource.icon.height = event.target.height;
                }
            };
            return (widget_1.tsx("tr", null,
                widget_1.tsx("td", null,
                    widget_1.tsx("img", { src: resource.icon.src, onload: onload }))));
        };
        Generator.prototype.startAnimation = function () {
            var resources = this.resources;
            if (!this.combinedElementsHeight) {
                for (var _i = 0, resources_1 = resources; _i < resources_1.length; _i++) {
                    var resource = resources_1[_i];
                    this.combinedElementsHeight += resource.icon.height;
                }
            }
            if (!this.firstElementHeight) {
                this.firstElementHeight = resources[0].icon.height;
            }
            var elementsCount = resources.length;
            var currentResourceIndex = this.resources.indexOf(this.getCurrentResource());
            var nextResourceIndex = currentResourceIndex + 1 + 2 * (elementsCount); // do 2 extra loops
            for (var index = currentResourceIndex; index < nextResourceIndex; index++) {
                var resourceIndex = index % elementsCount;
                this.targetY += resources[resourceIndex].icon.height;
            }
            this.animateGenerator();
        };
        Generator.prototype.getCurrentResource = function () {
            var indices = this.resources.map(function (_, index) { return index; });
            // wrap one element around
            indices.push(indices[0]);
            var iconHeights = 0;
            for (var _i = 0, indices_1 = indices; _i < indices_1.length; _i++) {
                var index = indices_1[_i];
                iconHeights += this.resources[index].icon.height;
                if (iconHeights > this.currentY) {
                    return this.resources[index];
                }
            }
        };
        Generator.prototype.animateGenerator = function () {
            return __awaiter(this, void 0, void 0, function () {
                var delta, table;
                var _this = this;
                return __generator(this, function (_a) {
                    delta = Math.pow(this.targetY, 0.5);
                    this.currentY += delta;
                    this.targetY -= delta;
                    if (this.currentY >= this.combinedElementsHeight + this.firstElementHeight) {
                        this.currentY -= this.combinedElementsHeight;
                    }
                    table = document.getElementById("resourceGenerator").childNodes[0];
                    table.style.transform = "translateY(-" + this.currentY + "px)";
                    if (this.targetY > 0) {
                        window.requestAnimationFrame(function () { return _this.animateGenerator(); });
                    }
                    else {
                        this.updateFeatureLayer();
                        this.cb(this.getCurrentResource().name);
                    }
                    return [2 /*return*/];
                });
            });
        };
        Generator.prototype.updateFeatureLayer = function () {
            var _this = this;
            var resource = this.getCurrentResource();
            if (!this.graphicsLayer.graphics.length) {
                this.createGraphics();
            }
            this.graphicsLayer.graphics.forEach(function (graphic) { return __awaiter(_this, void 0, void 0, function () {
                var symbol, symbolLayer;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(resource.symbol.type === "web-style")) return [3 /*break*/, 2];
                            return [4 /*yield*/, resource.symbol.fetchSymbol()];
                        case 1:
                            symbol = _a.sent();
                            if (resource.scale) {
                                symbolLayer = symbol.symbolLayers.getItemAt(0);
                                symbolLayer.width *= resource.scale;
                                symbolLayer.height *= resource.scale;
                                symbolLayer.depth *= resource.scale;
                            }
                            graphic.symbol = symbol;
                            return [3 /*break*/, 3];
                        case 2:
                            graphic.symbol = resource.symbol;
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
        };
        Generator.prototype.createGraphics = function () {
            for (var i = 0; i < 20; i++) {
                this.graphicsLayer.graphics.add(new Graphic({
                    geometry: new Point({
                        "spatialReference": {
                            "wkid": 102100
                        },
                        "x": -8238112.846146458,
                        "y": 4970465.220192298
                    }),
                    attributes: {
                        "OBJECTID": i
                    }
                }));
            }
        };
        __decorate([
            decorators_1.property()
        ], Generator.prototype, "graphicsLayer", void 0);
        __decorate([
            decorators_1.property()
        ], Generator.prototype, "resources", void 0);
        __decorate([
            decorators_1.property()
        ], Generator.prototype, "cb", void 0);
        Generator = __decorate([
            decorators_1.subclass("esri.widgets.Generator")
        ], Generator);
        return Generator;
    }(decorators_1.declared(Widget)));
    exports.Generator = Generator;
});
