define(["require", "exports", "esri/core/accessorSupport/decorators", "esri/core/Accessor", "esri/core/watchUtils"], function (require, exports, decorators_1, Accessor, watchUtils) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var Animator = /** @class */ (function (_super) {
        __extends(Animator, _super);
        function Animator(properties) {
            var _this = _super.call(this, properties) || this;
            _this.view = null;
            _this.graphicsLayer = null;
            _this.scenario = null;
            _this.cameraEnabled = false;
            _this.audioEnabled = false;
            _this.ticks = 0;
            _this.average = 0;
            _this.rotationStates = new Map();
            _this.rotationHeadings = new Map();
            return _this;
        }
        Animator.prototype.initialize = function () {
            var _this = this;
            watchUtils.watch(this, "scenario", function (scenario) {
                _this.view.camera = scenario.config.camera;
            });
        };
        Animator.prototype.startCamera = function () {
            this.cameraEnabled = true;
            this.animateCamera();
        };
        Animator.prototype.stopCamera = function () {
            this.cameraEnabled = false;
        };
        Animator.prototype.startAudio = function () {
            if (!this.audioElement) {
                this.createDomElements();
            }
            this.audioElement.play();
            this.audioEnabled = true;
            this.animateResources();
        };
        Animator.prototype.stopAudio = function () {
            this.audioElement.pause();
            this.audioEnabled = false;
        };
        Animator.prototype.resetState = function () {
            this.rotationHeadings.clear();
            this.rotationStates.clear();
        };
        Animator.prototype.animateCamera = function () {
            var _this = this;
            if (!this.cameraEnabled || !this.scenario) {
                return;
            }
            var _a = this, view = _a.view, graphicsLayer = _a.graphicsLayer, _b = _a.scenario, config = _b.config, tick = _b.tick;
            if (view.camera) {
                tick(this.ticks++, { config: config, view: view, graphicsLayer: graphicsLayer });
            }
            window.requestAnimationFrame(function () { return _this.animateCamera(); });
        };
        Animator.prototype.animateResources = function () {
            return __awaiter(this, void 0, void 0, function () {
                var requestFrame, canvasElement, barWidth, barHeight, x, i, color, numFeatures, bufferAverage, i_1, i_2, graphic, uid, angle;
                var _this = this;
                return __generator(this, function (_a) {
                    requestFrame = false;
                    if (this.audioAnalyser) {
                        canvasElement = this.canvasElement;
                        this.audioAnalyser.getByteFrequencyData(this.dataArray);
                        this.canvasContext.clearRect(0, 0, canvasElement.width, canvasElement.height);
                        barWidth = (canvasElement.width / this.bufferLength) * 2.5;
                        x = 0;
                        for (i = 0; i < this.bufferLength; i++) {
                            barHeight = this.dataArray[i] / 2;
                            color = barHeight + 100;
                            this.canvasContext.fillStyle = "rgba(" + color + ", " + color + ", " + color + ", 0.6)";
                            this.canvasContext.fillRect(x, canvasElement.height - barHeight / 2, barWidth, barHeight);
                            x += barWidth + 1;
                        }
                        numFeatures = this.graphicsLayer.graphics.length;
                        bufferAverage = 0;
                        for (i_1 = 0; i_1 < this.bufferLength; i_1++) {
                            bufferAverage += this.dataArray[i_1];
                        }
                        bufferAverage /= this.bufferLength;
                        this.average -= this.average / 10;
                        this.average += bufferAverage / 10;
                        for (i_2 = 0; i_2 < numFeatures; i_2++) {
                            graphic = this.graphicsLayer.graphics.getItemAt(i_2);
                            uid = graphic.attributes["OBJECTID"];
                            if (this.average > 20) {
                                angle = this.rotationStates.get(uid) || 0;
                                if (angle < 1) {
                                    this.rotationStates.set(uid, angle + Math.floor(bufferAverage / 20) * 360);
                                }
                                else {
                                    this.rotationStates.set(uid, angle * 0.9);
                                }
                                requestFrame = true;
                            }
                        }
                    }
                    // ---------------------------------------------------------------
                    this.graphicsLayer.graphics.forEach(function (graphic) {
                        if (!graphic.symbol || graphic.symbol.type !== "point-3d") {
                            return;
                        }
                        var uid = graphic.attributes["OBJECTID"];
                        var clone = graphic.symbol.clone();
                        var symbolLayer = clone.symbolLayers.getItemAt(0);
                        if (symbolLayer && symbolLayer.type === "object") {
                            if (!_this.rotationHeadings.has(uid)) {
                                _this.rotationHeadings.set(uid, symbolLayer.heading);
                                _this.rotationStates.set(uid, 0);
                            }
                            symbolLayer.heading = _this.rotationHeadings.get(uid) + _this.rotationStates.get(uid);
                        }
                        graphic.symbol = clone;
                    });
                    if (this.audioEnabled || requestFrame) {
                        window.requestAnimationFrame(function () { return _this.animateResources(); });
                    }
                    return [2 /*return*/];
                });
            });
        };
        Animator.prototype.createDomElements = function () {
            var canvasElement = document.createElement("canvas");
            canvasElement.setAttribute("id", "equalizerCanvas");
            this.canvasElement = canvasElement;
            document.body.appendChild(canvasElement);
            this.canvasContext = canvasElement.getContext("2d");
            this.canvasContext.clearRect(0, 0, canvasElement.width, canvasElement.height);
            var audioElement = document.createElement("audio");
            audioElement.setAttribute("src", "assets/super_mario_bros.mp3");
            audioElement.setAttribute("type", "audio/mpg");
            audioElement.loop = true;
            document.querySelector("head").appendChild(audioElement);
            this.audioElement = audioElement;
            var AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext();
            var audioSource = this.audioContext.createMediaElementSource(audioElement);
            audioSource.connect(this.audioContext.destination);
            this.audioAnalyser = this.audioContext.createAnalyser();
            audioSource.connect(this.audioAnalyser);
            this.audioAnalyser.fftSize = 2048;
            this.bufferLength = this.audioAnalyser.frequencyBinCount;
            this.dataArray = new Uint8Array(this.bufferLength);
            this.audioAnalyser.getByteFrequencyData(this.dataArray);
        };
        __decorate([
            decorators_1.property()
        ], Animator.prototype, "view", void 0);
        __decorate([
            decorators_1.property()
        ], Animator.prototype, "scenario", void 0);
        __decorate([
            decorators_1.property()
        ], Animator.prototype, "cameraEnabled", void 0);
        __decorate([
            decorators_1.property()
        ], Animator.prototype, "audioEnabled", void 0);
        Animator = __decorate([
            decorators_1.subclass()
        ], Animator);
        return Animator;
    }(decorators_1.declared(Accessor)));
    exports.Animator = Animator;
});
