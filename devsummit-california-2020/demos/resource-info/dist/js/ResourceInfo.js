define(["require", "exports", "esri/core/tsSupport/declareExtendsHelper", "esri/core/tsSupport/decorateHelper", "esri/core/accessorSupport/decorators", "esri/widgets/Widget", "esri/widgets/support/widget", "esri/core/watchUtils"], function (require, exports, __extends, __decorate, decorators_1, Widget, widget_1, watchUtils) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var CSS = {
        selected: "selected",
        small: "small",
    };
    var MESSAGES = {
        unsupported: "This layer is not supported"
    };
    var ResourceInfo = /** @class */ (function (_super) {
        __extends(ResourceInfo, _super);
        //--------------------------------------------------------------------------
        //
        //  Lifecycle
        //
        //--------------------------------------------------------------------------
        function ResourceInfo(properties) {
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
        ResourceInfo.prototype.initialize = function () {
            var _this = this;
            watchUtils.init(this, "view", function () {
                if (_this.intervalHandle) {
                    window.clearInterval(_this.intervalHandle);
                }
                window.setInterval(function () { return _this.renderNow(); }, 1000);
            });
        };
        ResourceInfo.prototype.destroy = function () {
            this.intervalHandle && window.clearInterval(this.intervalHandle);
        };
        //--------------------------------------------------------------------------
        //
        //  Public Methods
        //
        //--------------------------------------------------------------------------
        ResourceInfo.prototype.render = function () {
            var className = this.view.popup.dockEnabled ? CSS.small : "";
            return (widget_1.tsx("div", { id: "resourceInfo", class: className, role: "presentation", key: "esri-resource-info__root" }, this.renderContainerNode()));
        };
        ResourceInfo.prototype.renderContainerNode = function () {
            if (!this.visible) {
                return null;
            }
            if (!this.view) {
                return this.renderUnsupportedMessage();
            }
            var resourceInfo = this.view.resourceInfo;
            var layerResourceInfoNodes = [];
            for (var _i = 0, _a = resourceInfo.layerResourceInfo; _i < _a.length; _i++) {
                var layerResourceInfo = _a[_i];
                layerResourceInfoNodes.push(this.renderLayerResourceInfoNode(resourceInfo, layerResourceInfo));
            }
            return (widget_1.tsx("div", { key: "resource-info_root" },
                widget_1.tsx("table", null,
                    widget_1.tsx("thead", null,
                        widget_1.tsx("tr", null,
                            widget_1.tsx("td", { colspan: "3" }, "Performance"))),
                    widget_1.tsx("tbody", null,
                        widget_1.tsx("tr", null,
                            widget_1.tsx("td", null, "Quality:"),
                            widget_1.tsx("td", { colspan: "2" },
                                Math.round(100 * resourceInfo.quality),
                                "%")),
                        widget_1.tsx("tr", null,
                            widget_1.tsx("td", null, "Load:"),
                            widget_1.tsx("td", { colspan: "2" }, Math.floor(resourceInfo.load)))),
                    widget_1.tsx("thead", null,
                        widget_1.tsx("tr", null,
                            widget_1.tsx("td", { colspan: "3" }, "Memory"))),
                    widget_1.tsx("tbody", null,
                        widget_1.tsx("tr", null,
                            widget_1.tsx("td", null, "Total:"),
                            widget_1.tsx("td", { colspan: "2" }, toScientificNotation(resourceInfo.totalMemory))),
                        widget_1.tsx("tr", null,
                            widget_1.tsx("td", null, "Used:"),
                            widget_1.tsx("td", null, toScientificNotation(resourceInfo.usedMemory)),
                            widget_1.tsx("td", null, this.renderMemoryBar("usedMemory", resourceInfo))),
                        widget_1.tsx("tr", null,
                            widget_1.tsx("td", null, "Terrain:"),
                            widget_1.tsx("td", null, toScientificNotation(resourceInfo.terrainMemory)),
                            widget_1.tsx("td", null, this.renderMemoryBar("terrainMemory", resourceInfo))),
                        widget_1.tsx("tr", null,
                            widget_1.tsx("td", null, "Edges:"),
                            widget_1.tsx("td", null, toScientificNotation(resourceInfo.edgesMemory)),
                            widget_1.tsx("td", null, this.renderMemoryBar("edgesMemory", resourceInfo)))),
                    widget_1.tsx("thead", null,
                        widget_1.tsx("tr", null,
                            widget_1.tsx("td", { colspan: "3" }, "Layers"))),
                    widget_1.tsx("tbody", null, layerResourceInfoNodes))));
        };
        ResourceInfo.prototype.renderUnsupportedMessage = function () {
            return (widget_1.tsx("div", { key: "resource-info__unsupported" },
                widget_1.tsx("p", null, MESSAGES.unsupported)));
        };
        ResourceInfo.prototype.renderLayerResourceInfoNode = function (resourceInfo, layerResourceInfo) {
            var layerTypeMap = {
                "scene": "SceneLayer",
                "feature": "FeatureLayer",
                "tile": "TileLayer",
                "vector-tile": "VectorTileLayer",
                "elevation": "ElevationLayer",
                "base-elevation": "ElevationLayer"
            };
            return (widget_1.tsx("tr", { key: "resource-info_layer_" + layerResourceInfo.layer.id },
                widget_1.tsx("td", null, layerTypeMap[layerResourceInfo.layer.type]),
                widget_1.tsx("td", null, toScientificNotation(layerResourceInfo.memory)),
                widget_1.tsx("td", null,
                    widget_1.tsx("div", { class: "memoryIndicator", key: "resource-info_layer_" + layerResourceInfo.layer.id + "_memoery" },
                        widget_1.tsx("div", { class: "memoryIndicatorValue", style: "width: " + 100 * layerResourceInfo.memory / resourceInfo.totalMemory + "%" })))));
        };
        ResourceInfo.prototype.renderMemoryBar = function (key, resourceInfo) {
            if (key === "layerResourceInfo") {
                return;
            }
            return (widget_1.tsx("div", { class: "memoryIndicator", key: "resource-info_root_" + key },
                widget_1.tsx("div", { class: "memoryIndicatorValue", style: "width: " + 100 * resourceInfo[key] / resourceInfo.totalMemory + "%" })));
        };
        __decorate([
            decorators_1.property()
        ], ResourceInfo.prototype, "view", void 0);
        __decorate([
            decorators_1.property(),
            widget_1.renderable()
        ], ResourceInfo.prototype, "visible", void 0);
        __decorate([
            decorators_1.property(),
            widget_1.renderable()
        ], ResourceInfo.prototype, "active", void 0);
        ResourceInfo = __decorate([
            decorators_1.subclass("esri.widgets.ResourceInfo")
        ], ResourceInfo);
        return ResourceInfo;
    }(decorators_1.declared(Widget)));
    exports.ResourceInfo = ResourceInfo;
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
