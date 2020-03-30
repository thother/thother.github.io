define(["require", "exports", "esri/core/tsSupport/declareExtendsHelper", "esri/core/tsSupport/decorateHelper", "esri/core/accessorSupport/decorators", "esri/widgets/Widget", "esri/widgets/support/widget", "esri/core/watchUtils"], function (require, exports, __extends, __decorate, decorators_1, Widget, widget_1, watchUtils) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var CSS = {
        selected: "selected",
        small: "small",
    };
    var MESSAGES = {
        unsupported: "This layer is not supported"
    };
    var PerformanceInfo = /** @class */ (function (_super) {
        __extends(PerformanceInfo, _super);
        //--------------------------------------------------------------------------
        //
        //  Lifecycle
        //
        //--------------------------------------------------------------------------
        function PerformanceInfo(properties) {
            var _this = _super.call(this) || this;
            //--------------------------------------------------------------------------
            //
            //  Properties
            //
            //--------------------------------------------------------------------------
            _this.view = null;
            //--------------------------------------------------------------------------
            //
            //  Private Methods
            //
            //--------------------------------------------------------------------------
            _this.intervalHandle = null;
            return _this;
        }
        PerformanceInfo.prototype.initialize = function () {
            var _this = this;
            watchUtils.init(this, "view", function () {
                if (_this.intervalHandle) {
                    window.clearInterval(_this.intervalHandle);
                }
                window.setInterval(function () { return _this.renderNow(); }, 1000);
            });
        };
        PerformanceInfo.prototype.destroy = function () {
            this.intervalHandle && window.clearInterval(this.intervalHandle);
        };
        //--------------------------------------------------------------------------
        //
        //  Public Methods
        //
        //--------------------------------------------------------------------------
        PerformanceInfo.prototype.render = function () {
            var className = this.view.popup.dockEnabled ? CSS.small : "";
            return (widget_1.tsx("div", { id: "performanceInfo", class: className, role: "presentation", key: "esri-performance-info__root" }, this.renderContainerNode()));
        };
        PerformanceInfo.prototype.renderContainerNode = function () {
            if (!this.visible) {
                return null;
            }
            if (!this.view) {
                return this.renderUnsupportedMessage();
            }
            var performanceInfo = this.view.performanceInfo;
            var layerPerformanceInfoNodes = [];
            for (var _i = 0, _a = performanceInfo.layerPerformanceInfos; _i < _a.length; _i++) {
                var layerPerformanceInfo = _a[_i];
                layerPerformanceInfoNodes.push(this.renderLayerPerformanceInfoNode(performanceInfo, layerPerformanceInfo));
            }
            return (widget_1.tsx("div", { key: "performance-info_root" },
                widget_1.tsx("table", null,
                    widget_1.tsx("thead", null,
                        widget_1.tsx("tr", null,
                            widget_1.tsx("td", { colspan: "3" }, "Performance"))),
                    widget_1.tsx("tbody", null,
                        widget_1.tsx("tr", null,
                            widget_1.tsx("td", null, "Quality:"),
                            widget_1.tsx("td", { colspan: "2" },
                                Math.round(100 * performanceInfo.quality),
                                "%")),
                        widget_1.tsx("tr", null,
                            widget_1.tsx("td", null, "Load:"),
                            widget_1.tsx("td", { colspan: "2" }, Math.floor(performanceInfo.load)))),
                    widget_1.tsx("thead", null,
                        widget_1.tsx("tr", null,
                            widget_1.tsx("td", { colspan: "3" }, "Memory"))),
                    widget_1.tsx("tbody", null,
                        widget_1.tsx("tr", null,
                            widget_1.tsx("td", null, "Total:"),
                            widget_1.tsx("td", { colspan: "2" }, toScientificNotation(performanceInfo.totalMemory))),
                        widget_1.tsx("tr", null,
                            widget_1.tsx("td", null, "Used:"),
                            widget_1.tsx("td", null, toScientificNotation(performanceInfo.usedMemory)),
                            widget_1.tsx("td", null, this.renderMemoryBar("usedMemory", performanceInfo))),
                        widget_1.tsx("tr", null,
                            widget_1.tsx("td", null, "Terrain:"),
                            widget_1.tsx("td", null, toScientificNotation(performanceInfo.terrainMemory)),
                            widget_1.tsx("td", null, this.renderMemoryBar("terrainMemory", performanceInfo))),
                        widget_1.tsx("tr", null,
                            widget_1.tsx("td", null, "Edges:"),
                            widget_1.tsx("td", null, toScientificNotation(performanceInfo.edgesMemory)),
                            widget_1.tsx("td", null, this.renderMemoryBar("edgesMemory", performanceInfo)))),
                    widget_1.tsx("thead", null,
                        widget_1.tsx("tr", null,
                            widget_1.tsx("td", { colspan: "3" }, "Layers"))),
                    widget_1.tsx("tbody", null, layerPerformanceInfoNodes))));
        };
        PerformanceInfo.prototype.renderUnsupportedMessage = function () {
            return (widget_1.tsx("div", { key: "performance-info__unsupported" },
                widget_1.tsx("p", null, MESSAGES.unsupported)));
        };
        PerformanceInfo.prototype.renderLayerPerformanceInfoNode = function (performanceInfo, layerPerformanceInfo) {
            var layerTypeMap = {
                "scene": "SceneLayer",
                "feature": "FeatureLayer",
                "tile": "TileLayer",
                "vector-tile": "VectorTileLayer",
                "elevation": "ElevationLayer",
                "base-elevation": "ElevationLayer"
            };
            return (widget_1.tsx("tr", { key: "performance-info_layer_" + layerPerformanceInfo.layer.id },
                widget_1.tsx("td", null, layerTypeMap[layerPerformanceInfo.layer.type]),
                widget_1.tsx("td", null, toScientificNotation(layerPerformanceInfo.memory)),
                widget_1.tsx("td", null,
                    widget_1.tsx("div", { class: "memoryIndicator", key: "performance-info_layer_" + layerPerformanceInfo.layer.id + "_memory" },
                        widget_1.tsx("div", { class: "memoryIndicatorValue", style: "width: " + 100 * layerPerformanceInfo.memory / performanceInfo.totalMemory + "%" })))));
        };
        PerformanceInfo.prototype.renderMemoryBar = function (key, performanceInfo) {
            if (key === "layerPerformanceInfos") {
                return;
            }
            return (widget_1.tsx("div", { class: "memoryIndicator", key: "performance-info_root_" + key },
                widget_1.tsx("div", { class: "memoryIndicatorValue", style: "width: " + 100 * performanceInfo[key] / performanceInfo.totalMemory + "%" })));
        };
        __decorate([
            decorators_1.property()
        ], PerformanceInfo.prototype, "view", void 0);
        __decorate([
            decorators_1.property(),
            widget_1.renderable()
        ], PerformanceInfo.prototype, "visible", void 0);
        __decorate([
            decorators_1.property(),
            widget_1.renderable()
        ], PerformanceInfo.prototype, "active", void 0);
        PerformanceInfo = __decorate([
            decorators_1.subclass("esri.widgets.PerformanceInfo")
        ], PerformanceInfo);
        return PerformanceInfo;
    }(decorators_1.declared(Widget)));
    exports.PerformanceInfo = PerformanceInfo;
    function toScientificNotation(value) {
        value = Math.floor(value);
        if (value > 1e+9) {
            return Math.floor(value / 1e+9) + " GB";
        }
        else if (value > 1e+6) {
            return Math.floor(value / 1e+6) + " MB";
        }
        else if (value > 1e+3) {
            return Math.floor(value / 1e+3) + " KB";
        }
        else {
            return value + " B";
        }
    }
});
