define(["require", "exports", "esri/core/accessorSupport/decorators", "esri/widgets/Widget", "esri/core/watchUtils", "esri/widgets/support/widget"], function (require, exports, decorators_1, Widget, watchUtils, widget_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var CSS = {
        red: "red",
        yellow: "yellow",
        green: "green",
        tooltip_left: "tooltip tooltip-left tooltip-multiline modifier-class",
    };
    var MESSAGES = {
        tooltip_fps: "Shows the current number of frames per second."
    };
    var FPSInfo = /** @class */ (function (_super) {
        __extends(FPSInfo, _super);
        //--------------------------------------------------------------------------
        //
        //  Lifecycle
        //
        //--------------------------------------------------------------------------
        function FPSInfo(intervalHandle) {
            if (intervalHandle === void 0) { intervalHandle = null; }
            var _this = _super.call(this) || this;
            _this.intervalHandle = intervalHandle;
            _this.fpsTimestamp = 0;
            _this.fpsMeasurements = new Array(90);
            _this.fpsMeasurementsIndex = 0;
            return _this;
        }
        FPSInfo.prototype.initialize = function () {
            var _this = this;
            watchUtils.init(this, "view", function () {
                if (_this.intervalHandle) {
                    window.clearInterval(_this.intervalHandle);
                }
                window.setInterval(function () { return _this.renderNow(); }, 1000);
            });
            this.measureFramesPerSecond();
        };
        FPSInfo.prototype.destroy = function () {
            this.intervalHandle && window.clearInterval(this.intervalHandle);
        };
        //--------------------------------------------------------------------------
        //
        //  Public Methods
        //
        //--------------------------------------------------------------------------
        FPSInfo.prototype.render = function () {
            var fps = this.getFramesPerSecond();
            return (widget_1.tsx("div", { id: "fpsInfo", class: fps > 50 ? CSS.green : fps > 30 ? CSS.yellow : CSS.red },
                widget_1.tsx("span", { class: CSS.tooltip_left, "aria-label": MESSAGES.tooltip_fps }, Math.floor(fps))));
        };
        FPSInfo.prototype.measureFramesPerSecond = function () {
            var _this = this;
            var now = performance.now();
            var milisecondsBetweenAnimationFrames = now - this.fpsTimestamp;
            this.fpsTimestamp = now;
            this.fpsMeasurements[this.fpsMeasurementsIndex] = Math.round(1000 / milisecondsBetweenAnimationFrames);
            this.fpsMeasurementsIndex = (this.fpsMeasurementsIndex + 1) % this.fpsMeasurements.length;
            window.requestAnimationFrame(function () { return _this.measureFramesPerSecond(); });
        };
        FPSInfo.prototype.getFramesPerSecond = function () {
            return this.fpsMeasurements.reduce(function (sum, cur) { return (sum + cur); }, 0) / this.fpsMeasurements.length;
        };
        FPSInfo = __decorate([
            decorators_1.subclass("esri.widgets.FPSInfo")
        ], FPSInfo);
        return FPSInfo;
    }(decorators_1.declared(Widget)));
    exports.FPSInfo = FPSInfo;
});
