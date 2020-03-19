define(["require", "exports", "esri/views/SceneView", "./ResourceInfo", "./PerformanceInfo", "./Generator", "esri/Camera", "./Controller", "./config", "./Animator", "esri/core/accessorSupport/decorators", "esri/core/Accessor", "esri/core/watchUtils", "esri/geometry/Point"], function (require, exports, SceneView, ResourceInfo_1, PerformanceInfo_1, Generator_1, Camera, Controller_1, config_1, Animator_1, decorators_1, Accessor, watchUtils, Point) {
    var Demo = /** @class */ (function (_super) {
        __extends(Demo, _super);
        function Demo(properties) {
            var _this = _super.call(this) || this;
            _this.viewDiv = null;
            _this.view = null;
            _this.sceneLayerView = null;
            _this.featureLayerView = null;
            _this.animator = null;
            return _this;
        }
        Demo.prototype.initialize = function () {
            var _this = this;
            watchUtils.on(this, "view.map.layers", "change", function (changeEvent) { return __awaiter(_this, void 0, void 0, function () {
                var _i, _a, added, _b, _c, removed;
                var _this = this;
                return __generator(this, function (_d) {
                    for (_i = 0, _a = changeEvent.added; _i < _a.length; _i++) {
                        added = _a[_i];
                        if (added === config_1.sceneLayer) {
                            this.view.whenLayerView(config_1.sceneLayer).then(function (lv) {
                                _this.sceneLayerView = lv;
                                if (_this.featureLayerView && _this.featureLayerView.filter) {
                                    _this.sceneLayerView.filter = config_1.sceneLayerFeatureFilter;
                                }
                            });
                        }
                        if (added === config_1.featureLayer) {
                            this.view.whenLayerView(config_1.featureLayer).then(function (lv) {
                                _this.featureLayerView = lv;
                                if (_this.sceneLayerView && _this.sceneLayerView.filter) {
                                    _this.featureLayerView.filter = config_1.featureLayerFeatureFilter;
                                }
                            });
                        }
                    }
                    for (_b = 0, _c = changeEvent.removed; _b < _c.length; _b++) {
                        removed = _c[_b];
                        if (removed === config_1.featureLayer) {
                            this.featureLayerView = null;
                        }
                        if (removed === config_1.sceneLayer) {
                            this.sceneLayerView = null;
                        }
                    }
                    return [2 /*return*/];
                });
            }); });
            var view = this.view = new SceneView({
                map: {
                    basemap: "satellite",
                    layers: [config_1.graphicsLayer],
                    ground: {
                        layers: []
                    }
                },
                container: this.viewDiv
            });
            this.animator = new Animator_1.Animator({ view: view, graphicsLayer: config_1.graphicsLayer });
            this.load();
        };
        Demo.prototype.load = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, view, animator, controlGroups, animationScenarios, controller, generator, resourceInfo, performanceInfoInfo;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = this, view = _a.view, animator = _a.animator;
                            controlGroups = [
                                [{
                                        icon: "ground",
                                        caption: "ground",
                                        select: function () {
                                            if (_this.hasLayers([config_1.exaggeratedElevationLayer, config_1.normalElevationLayer])) {
                                                view.map.ground.layers.removeAll();
                                            }
                                            else {
                                                view.map.ground.layers.add(config_1.normalElevationLayer);
                                            }
                                        },
                                        selected: function () { return _this.hasLayers([config_1.exaggeratedElevationLayer, config_1.normalElevationLayer]); }
                                    }, {
                                        icon: "ground",
                                        caption: "normal",
                                        select: function () {
                                            if (_this.hasLayers([config_1.normalElevationLayer])) {
                                                view.map.ground.layers.remove(config_1.normalElevationLayer);
                                            }
                                            else {
                                                view.map.ground.layers.removeAll();
                                                view.map.ground.layers.add(config_1.normalElevationLayer);
                                            }
                                        },
                                        selected: function () { return _this.hasLayers([config_1.normalElevationLayer]); }
                                    }, {
                                        icon: "ground",
                                        caption: "exagger.",
                                        select: function () {
                                            if (_this.hasLayers([config_1.exaggeratedElevationLayer])) {
                                                view.map.ground.layers.remove(config_1.exaggeratedElevationLayer);
                                            }
                                            else {
                                                view.map.ground.layers.removeAll();
                                                view.map.ground.layers.add(config_1.exaggeratedElevationLayer);
                                            }
                                            config_1.exaggeratedElevationLayer.exaggeration = animator.scenario === animationScenarios[0] ? 200 : 5;
                                        },
                                        selected: function () { return _this.hasLayers([config_1.exaggeratedElevationLayer]); }
                                    }],
                                [{
                                        icon: "basemap",
                                        caption: "basemap",
                                        select: function () {
                                            if (_this.hasLayers([config_1.imageTileLayer, config_1.vectorTileLayer])) {
                                                view.map.basemap.baseLayers.removeAll();
                                            }
                                            else {
                                                view.map.basemap.baseLayers.add(config_1.imageTileLayer);
                                            }
                                        },
                                        selected: function () { return _this.hasLayers([config_1.imageTileLayer, config_1.vectorTileLayer]); }
                                    }, {
                                        icon: "basemap",
                                        caption: "image",
                                        select: function () {
                                            if (_this.hasLayers([config_1.imageTileLayer])) {
                                                view.map.basemap.baseLayers.remove(config_1.imageTileLayer);
                                            }
                                            else {
                                                view.map.basemap.baseLayers.removeAll();
                                                view.map.basemap.baseLayers.add(config_1.imageTileLayer);
                                            }
                                        },
                                        selected: function () { return _this.hasLayers([config_1.imageTileLayer]); }
                                    }, {
                                        icon: "basemap",
                                        caption: "vector",
                                        select: function () {
                                            if (_this.hasLayers([config_1.vectorTileLayer])) {
                                                view.map.basemap.baseLayers.remove(config_1.vectorTileLayer);
                                            }
                                            else {
                                                view.map.basemap.baseLayers.removeAll();
                                                view.map.basemap.baseLayers.add(config_1.vectorTileLayer);
                                            }
                                        },
                                        selected: function () { return _this.hasLayers([config_1.vectorTileLayer]); }
                                    }],
                                [{
                                        icon: "scene",
                                        caption: "scene",
                                        select: function () {
                                            if (_this.hasLayers([config_1.sceneLayer])) {
                                                view.map.layers.remove(config_1.sceneLayer);
                                            }
                                            else {
                                                view.map.layers.add(config_1.sceneLayer);
                                            }
                                        },
                                        selected: function () { return _this.hasLayers([config_1.sceneLayer]); }
                                    }, {
                                        icon: "scene",
                                        caption: "normal",
                                        select: function () {
                                            if (_this.hasLayers([config_1.sceneLayer]) && config_1.sceneLayer.renderer === config_1.normalSeneRenderer) {
                                                view.map.layers.remove(config_1.sceneLayer);
                                            }
                                            else if (!_this.hasLayers([config_1.sceneLayer])) {
                                                view.map.layers.add(config_1.sceneLayer);
                                            }
                                            config_1.sceneLayer.renderer = config_1.normalSeneRenderer;
                                        },
                                        selected: function () { return _this.hasLayers([config_1.sceneLayer]) && config_1.sceneLayer.renderer === config_1.normalSeneRenderer; }
                                    }, {
                                        icon: "scene",
                                        caption: "sketch",
                                        select: function () {
                                            if (_this.hasLayers([config_1.sceneLayer]) && config_1.sceneLayer.renderer === config_1.sketchSceneRenderer) {
                                                view.map.layers.remove(config_1.sceneLayer);
                                            }
                                            else if (!_this.hasLayers([config_1.sceneLayer])) {
                                                view.map.layers.add(config_1.sceneLayer);
                                            }
                                            config_1.sceneLayer.renderer = config_1.sketchSceneRenderer;
                                        },
                                        selected: function () { return _this.hasLayers([config_1.sceneLayer]) && config_1.sceneLayer.renderer === config_1.sketchSceneRenderer; }
                                    }],
                                [{
                                        icon: "feature",
                                        caption: "feature",
                                        select: function () {
                                            if (_this.hasLayers([config_1.featureLayer])) {
                                                view.map.layers.remove(config_1.featureLayer);
                                            }
                                            else {
                                                view.map.layers.add(config_1.featureLayer);
                                            }
                                        },
                                        selected: function () { return _this.hasLayers([config_1.featureLayer]); }
                                    }, {
                                        icon: "feature",
                                        caption: "absolute",
                                        select: function () {
                                            if (_this.hasLayers([config_1.featureLayer]) &&
                                                config_1.featureLayer.elevationInfo &&
                                                config_1.featureLayer.elevationInfo.mode === config_1.featureLayerElevationAbsolute.mode) {
                                                view.map.layers.remove(config_1.featureLayer);
                                            }
                                            else if (!_this.hasLayers([config_1.featureLayer])) {
                                                view.map.layers.add(config_1.featureLayer);
                                            }
                                            config_1.featureLayer.elevationInfo = config_1.featureLayerElevationAbsolute;
                                        },
                                        selected: function () { return _this.hasLayers([config_1.featureLayer]) &&
                                            config_1.featureLayer.elevationInfo &&
                                            config_1.featureLayer.elevationInfo.mode === config_1.featureLayerElevationAbsolute.mode; }
                                    }, {
                                        icon: "feature",
                                        caption: "relative",
                                        select: function () {
                                            if (_this.hasLayers([config_1.featureLayer]) &&
                                                config_1.featureLayer.elevationInfo &&
                                                config_1.featureLayer.elevationInfo.mode === config_1.featureLayerElevationRelative.mode) {
                                                view.map.layers.remove(config_1.featureLayer);
                                            }
                                            else if (!_this.hasLayers([config_1.featureLayer])) {
                                                view.map.layers.add(config_1.featureLayer);
                                            }
                                            config_1.featureLayer.elevationInfo = config_1.featureLayerElevationRelative;
                                        },
                                        selected: function () { return _this.hasLayers([config_1.featureLayer]) &&
                                            config_1.featureLayer.elevationInfo &&
                                            config_1.featureLayer.elevationInfo.mode === config_1.featureLayerElevationRelative.mode; }
                                    }],
                                [{
                                        icon: "filter",
                                        caption: "filter",
                                        select: function () {
                                            var _a = _this, featureLayerView = _a.featureLayerView, sceneLayerView = _a.sceneLayerView;
                                            if (featureLayerView && featureLayerView.filter || sceneLayerView && sceneLayerView.filter) {
                                                if (featureLayerView && featureLayerView.filter) {
                                                    featureLayerView.filter = null;
                                                }
                                                if (sceneLayerView && sceneLayerView.filter) {
                                                    sceneLayerView.filter = null;
                                                }
                                                config_1.featureLayer.definitionExpression = null;
                                                config_1.sceneLayer.definitionExpression = null;
                                            }
                                            else {
                                                if (config_1.featureLayer.definitionExpression || config_1.sceneLayer.definitionExpression) {
                                                    config_1.featureLayer.definitionExpression = null;
                                                    config_1.sceneLayer.definitionExpression = null;
                                                }
                                                else {
                                                    config_1.featureLayer.definitionExpression = config_1.featureLayerDefinitionExpression;
                                                    config_1.sceneLayer.definitionExpression = config_1.sceneLayerDefinitionExpression;
                                                }
                                            }
                                        },
                                        selected: function () { return !!(((config_1.featureLayer && config_1.featureLayer.definitionExpression) || (_this.featureLayerView && _this.featureLayerView.filter)) ||
                                            (config_1.sceneLayer && config_1.sceneLayer.definitionExpression) || (_this.sceneLayerView && _this.sceneLayerView.filter)); }
                                    }, {
                                        icon: "filter",
                                        caption: "server",
                                        select: function () {
                                            if (config_1.featureLayer.definitionExpression || config_1.sceneLayer.definitionExpression) {
                                                config_1.sceneLayer.definitionExpression = null;
                                                config_1.featureLayer.definitionExpression = null;
                                            }
                                            else {
                                                config_1.sceneLayer.definitionExpression = config_1.sceneLayerDefinitionExpression;
                                                config_1.featureLayer.definitionExpression = config_1.featureLayerDefinitionExpression;
                                            }
                                        },
                                        selected: function () { return !!(config_1.featureLayer.definitionExpression || config_1.sceneLayer.definitionExpression); }
                                    }, {
                                        icon: "filter",
                                        caption: "client",
                                        select: function () {
                                            var _a = _this, featureLayerView = _a.featureLayerView, sceneLayerView = _a.sceneLayerView;
                                            if (featureLayerView && featureLayerView.filter) {
                                                featureLayerView.filter = null;
                                            }
                                            else if (featureLayerView) {
                                                featureLayerView.filter = config_1.featureLayerFeatureFilter;
                                            }
                                            if (sceneLayerView && sceneLayerView.filter) {
                                                sceneLayerView.filter = null;
                                            }
                                            else if (sceneLayerView) {
                                                sceneLayerView.filter = config_1.sceneLayerFeatureFilter;
                                            }
                                        },
                                        selected: function () { return !!((_this.featureLayerView && _this.featureLayerView.filter) || (_this.sceneLayerView && _this.sceneLayerView.filter)); }
                                    }],
                                [{
                                        icon: "camera",
                                        caption: "camera",
                                        select: function () {
                                            if (animator.cameraEnabled) {
                                                animator.stopCamera();
                                            }
                                            else {
                                                animator.startCamera();
                                            }
                                        },
                                        selected: function () { return animator.cameraEnabled; }
                                    }, {
                                        icon: "camera",
                                        caption: "globe",
                                        select: function () {
                                            if (animator.cameraEnabled && animator.scenario === animationScenarios[0]) {
                                                animator.stopCamera();
                                            }
                                            else {
                                                animator.startCamera();
                                            }
                                            animator.scenario = animationScenarios[0];
                                        },
                                        selected: function () { return (animator.cameraEnabled && animator.scenario === animationScenarios[0]); }
                                    }, {
                                        icon: "camera",
                                        caption: "city",
                                        select: function () {
                                            if (animator.cameraEnabled && animator.scenario === animationScenarios[1]) {
                                                animator.stopCamera();
                                            }
                                            else {
                                                animator.startCamera();
                                            }
                                            animator.scenario = animationScenarios[1];
                                        },
                                        selected: function () { return (animator.cameraEnabled && animator.scenario === animationScenarios[1]); }
                                    }],
                                [{
                                        icon: "music",
                                        caption: "music",
                                        select: function () {
                                            if (animator.audioEnabled) {
                                                animator.stopAudio();
                                            }
                                            else {
                                                animator.startAudio();
                                            }
                                        },
                                        selected: function () { return animator.audioEnabled; }
                                    }]
                            ];
                            animationScenarios = [{
                                    name: "globe",
                                    config: {
                                        camera: new Camera({
                                            position: new Point({
                                                spatialReference: {
                                                    wkid: 102100
                                                },
                                                x: 0,
                                                y: 4969665,
                                                z: 5
                                            }),
                                            heading: 0,
                                            tilt: 0
                                        }),
                                        distance: 20000000,
                                        altitude: 50000000,
                                        speed: 2000,
                                        start: Date.now(),
                                        states: null
                                    },
                                    tick: function (ticks, resources) {
                                        var config = resources.config, view = resources.view;
                                        var camera = view.camera.clone();
                                        camera.position.x = config.camera.position.x + config.distance * ticks / config.speed;
                                        camera.position.y = config.camera.position.y + config.distance / 20 * Math.sin(ticks / config.speed);
                                        camera.position.z = config.altitude * (1 + Math.cos(ticks / config.speed) / 2);
                                        camera.heading = 0;
                                        camera.tilt = config.camera.tilt;
                                        view.environment.atmosphere.quality = "high";
                                        view.environment.lighting = {
                                            date: new Date(config.start - ticks / config.speed),
                                            directShadowsEnabled: false,
                                            ambientOcclusionEnabled: false
                                        };
                                        view.camera = camera;
                                    }
                                }, {
                                    name: "city",
                                    config: {
                                        camera: new Camera({
                                            position: new Point({
                                                spatialReference: {
                                                    wkid: 102100
                                                },
                                                x: -8238736.034643562,
                                                y: 4969665.590906493,
                                                z: 5.9063404854387045
                                            }),
                                            heading: 0,
                                            tilt: 70
                                        }),
                                        distance: 5000,
                                        altitude: 1000,
                                        speed: 500,
                                        start: Date.now(),
                                        states: null
                                    },
                                    tick: function (ticks, resources) {
                                        var config = resources.config, view = resources.view;
                                        var camera = view.camera.clone();
                                        camera.position.x = config.camera.position.x + config.distance * Math.cos(ticks / config.speed);
                                        camera.position.y = config.camera.position.y + config.distance * Math.sin(ticks / config.speed);
                                        camera.position.z = config.altitude + 300 * Math.cos(ticks / config.speed / 1.23456789);
                                        camera.heading = 360 - (ticks / config.speed / Math.PI * 180) - 90;
                                        camera.tilt = 90 - Math.atan(config.altitude / config.distance) / Math.PI * 180;
                                        view.environment.lighting = {
                                            date: new Date(config.start - ticks * config.speed * 100),
                                            directShadowsEnabled: false,
                                            ambientOcclusionEnabled: false
                                        };
                                        view.camera = camera;
                                    }
                                }, {
                                    name: "car",
                                    config: {
                                        camera: new Camera({
                                            position: new Point({
                                                spatialReference: {
                                                    wkid: 102100
                                                },
                                                x: -8238959.639566096,
                                                y: 4969571.6945557315,
                                                z: 3187.7089045317844
                                            }),
                                            heading: 30,
                                            tilt: 0.5
                                        }),
                                        distance: 1500,
                                        altitude: 750,
                                        speed: 200,
                                        start: Date.now(),
                                        states: new Map()
                                    },
                                    tick: function (ticks, resources) {
                                        var config = resources.config, view = resources.view;
                                        var camera = view.camera.clone();
                                        var distance = ((Date.now() - config.start) / 1000 * config.speed) % config_1.carAnimationLineLength;
                                        var _a = _this.findLineSegmentPosition(config_1.carAnimationLineSegmentLengths, distance), x = _a.x, y = _a.y, dx = _a.dx, dy = _a.dy;
                                        config.camera.position.x += 0.001 * (x + dx - config.camera.position.x);
                                        config.camera.position.y += 0.001 * (y + dy - config.camera.position.y);
                                        camera.position.x = config.camera.position.x + config.distance * Math.cos(ticks / config.speed);
                                        camera.position.y = config.camera.position.y + config.distance * Math.sin(ticks / config.speed);
                                        camera.position.z = config.altitude + config.altitude / 3 * Math.cos(ticks / config.speed / 1.23456789);
                                        camera.heading = 360 - (ticks / config.speed / Math.PI * 180) - 90;
                                        camera.tilt = (90 - Math.atan(config.altitude / config.distance) / Math.PI * 180);
                                        view.environment.lighting = {
                                            date: new Date(config.start - ticks * config.speed * 250),
                                            directShadowsEnabled: false,
                                            ambientOcclusionEnabled: false
                                        };
                                        view.camera = camera;
                                        // --
                                        var graphicsLength = config_1.graphicsLayer.graphics.length;
                                        for (var i = 0; i < graphicsLength; i++) {
                                            var graphic = config_1.graphicsLayer.graphics.getItemAt(i);
                                            var uid = graphic.uid;
                                            var speed = 10;
                                            var distance_1 = (i / graphicsLength * config_1.carAnimationLineLength + (Date.now() - config.start) / 1000 * speed) % config_1.carAnimationLineLength;
                                            var _b = _this.findLineSegmentPosition(config_1.carAnimationLineSegmentLengths, distance_1), x_1 = _b.x, y_1 = _b.y, dx_1 = _b.dx, dy_1 = _b.dy, idx = _b.idx;
                                            var clone = graphic.geometry.clone();
                                            clone.x = x_1 + dx_1;
                                            clone.y = y_1 + dy_1;
                                            clone.z = 0;
                                            graphic.geometry = clone;
                                            var hasLastSegment = config.states.has(uid);
                                            if (graphic.symbol && (!hasLastSegment || config.states.get(uid) != idx)) {
                                                var symbol = graphic.symbol.clone();
                                                var symbolLayer = symbol.symbolLayers.getItemAt(0);
                                                symbolLayer.heading = 360 - Math.atan2(dy_1, dx_1) / Math.PI * 180 + 90;
                                                graphic.symbol = symbol;
                                                config.states.set(uid, idx);
                                            }
                                        }
                                    }
                                }, {
                                    name: "boat",
                                    config: {
                                        camera: new Camera({
                                            position: new Point({
                                                spatialReference: {
                                                    wkid: 102100
                                                },
                                                x: -8240510.163080326,
                                                y: 4967989.839668392,
                                                z: 0
                                            }),
                                            heading: 0,
                                            tilt: 70
                                        }),
                                        distance: 2000,
                                        altitude: 200,
                                        speed: 500,
                                        start: Date.now(),
                                        states: new Map()
                                    },
                                    tick: function (ticks, resources) {
                                        var config = resources.config, view = resources.view;
                                        var camera = view.camera.clone();
                                        camera.position.x = config.camera.position.x + config.distance * Math.cos(ticks / config.speed);
                                        camera.position.y = config.camera.position.y + config.distance * Math.sin(ticks / config.speed);
                                        camera.position.z = config.altitude + 100 * Math.cos(ticks / config.speed / 1.23456789);
                                        camera.heading = 360 - (ticks / config.speed / Math.PI * 180) - 90;
                                        camera.tilt = 90 - Math.atan(config.altitude / config.distance) / Math.PI * 180;
                                        view.environment.lighting = {
                                            date: new Date(config.start - ticks * config.speed * 100),
                                            directShadowsEnabled: false,
                                            ambientOcclusionEnabled: false
                                        };
                                        view.camera = camera;
                                        var graphicsLength = config_1.graphicsLayer.graphics.length;
                                        for (var i = 0; i < graphicsLength; i++) {
                                            var graphic = config_1.graphicsLayer.graphics.getItemAt(i);
                                            var uid = graphic.uid;
                                            var areaRadius = 1000;
                                            var windAngle = 260;
                                            if (!config.states.has(uid)) {
                                                var windwardOffset = Math.random() - 0.5;
                                                var courseOffset = 120 * Math.random() - 60;
                                                var startOffset_1 = areaRadius * Math.random();
                                                var speed_1 = 25 + 25 * Math.random();
                                                var x1_1 = config.camera.position.x + areaRadius * (Math.cos((windAngle + 90 + courseOffset) / 180 * Math.PI) + Math.cos(windAngle / 180 * Math.PI) * windwardOffset);
                                                var y1_1 = config.camera.position.y + areaRadius * (Math.sin((windAngle + 90 + courseOffset) / 180 * Math.PI) + Math.sin(windAngle / 180 * Math.PI) * windwardOffset);
                                                var x2_1 = config.camera.position.x + areaRadius * (Math.cos((windAngle - 90 + courseOffset) / 180 * Math.PI) + Math.cos(windAngle / 180 * Math.PI) * windwardOffset);
                                                var y2_1 = config.camera.position.y + areaRadius * (Math.sin((windAngle - 90 + courseOffset) / 180 * Math.PI) + Math.sin(windAngle / 180 * Math.PI) * windwardOffset);
                                                var lineLength_1 = Math.sqrt(Math.pow(x2_1 - x1_1, 2) + Math.pow(y2_1 - y1_1, 2));
                                                config.states.set(uid, {
                                                    speed: speed_1,
                                                    startOffset: startOffset_1,
                                                    lineLength: lineLength_1,
                                                    x1: x1_1,
                                                    y1: y1_1,
                                                    x2: x2_1,
                                                    y2: y2_1,
                                                    symbol: null,
                                                });
                                            }
                                            var state = config.states.get(uid);
                                            var speed = state.speed, startOffset = state.startOffset, lineLength = state.lineLength, x1 = state.x1, y1 = state.y1, x2 = state.x2, y2 = state.y2;
                                            var traveledDistance = (Date.now() - config.start) / 1000 * speed + startOffset;
                                            var fraction = (traveledDistance % lineLength) / lineLength;
                                            var clone = graphic.geometry.clone();
                                            clone.x = x1 + fraction * (x2 - x1);
                                            clone.y = y1 + fraction * (y2 - y1);
                                            clone.z = 0;
                                            graphic.geometry = clone;
                                            var needsSymbolUpdate = !state.symbol || state.symbol !== graphic.symbol;
                                            if (needsSymbolUpdate && graphic.symbol) {
                                                var symbol = graphic.symbol.clone();
                                                var symbolLayer = symbol.symbolLayers.getItemAt(0);
                                                symbolLayer.heading = 360 - Math.atan2(state.y2 - state.y1, state.x2 - state.x1) / Math.PI * 180 + 90;
                                                symbolLayer.roll = symbolLayer.heading > windAngle ? 30 : -30;
                                                graphic.symbol = symbol;
                                                state.symbol = symbol;
                                            }
                                        }
                                    }
                                }, {
                                    name: "tree",
                                    config: {
                                        camera: new Camera({
                                            position: new Point({
                                                spatialReference: {
                                                    wkid: 102100
                                                },
                                                x: -8242666.879809741,
                                                y: 4966710.08634817,
                                                z: 0
                                            }),
                                            heading: 0,
                                            tilt: 70
                                        }),
                                        distance: 300,
                                        altitude: 100,
                                        speed: 200,
                                        start: Date.now(),
                                        states: new Map()
                                    },
                                    tick: function (ticks, resources) {
                                        var config = resources.config, view = resources.view;
                                        var camera = view.camera.clone();
                                        camera.position.x = config.camera.position.x + (config.distance + 200 * Math.cos(ticks / config.speed / 1.23456789)) * Math.cos(ticks / config.speed);
                                        camera.position.y = config.camera.position.y + (config.distance + 200 * Math.cos(ticks / config.speed / 1.23456789)) * Math.sin(ticks / config.speed);
                                        camera.position.z = config.altitude + 50 * Math.cos(ticks / config.speed / 1.23456789);
                                        camera.heading = 360 - (ticks / config.speed / Math.PI * 180) - 90;
                                        camera.tilt = 90 - Math.atan(config.altitude / config.distance) / Math.PI * 180;
                                        view.environment.lighting = {
                                            date: new Date(config.start - ticks * config.speed * 100),
                                            directShadowsEnabled: false,
                                            ambientOcclusionEnabled: false
                                        };
                                        view.camera = camera;
                                        // --
                                        var graphicsLength = config_1.graphicsLayer.graphics.length;
                                        for (var i = 0; i < graphicsLength; i++) {
                                            var graphic = config_1.graphicsLayer.graphics.getItemAt(i);
                                            var uid = graphic.uid;
                                            var distance = 100;
                                            if (!config.states.has(uid)) {
                                                config.states.set(uid, true);
                                                var clone = graphic.geometry.clone();
                                                clone.x = config.camera.position.x + distance * (Math.random() - 0.5);
                                                clone.y = config.camera.position.y + distance * (Math.random() - 0.5);
                                                clone.z = 0;
                                                graphic.geometry = clone;
                                            }
                                        }
                                    }
                                }, {
                                    name: "airplane",
                                    config: {
                                        camera: new Camera({
                                            position: new Point({
                                                spatialReference: {
                                                    wkid: 102100
                                                },
                                                x: -8237376.640397705,
                                                y: 4971360.6452791905,
                                                z: 0
                                            }),
                                            heading: 0,
                                            tilt: 70
                                        }),
                                        distance: 2500,
                                        altitude: 1400,
                                        speed: 500,
                                        start: Date.now(),
                                        states: new Map()
                                    },
                                    tick: function (ticks, resources) {
                                        var config = resources.config, view = resources.view;
                                        var graphicsLength = config_1.graphicsLayer.graphics.length;
                                        for (var i = 0; i < graphicsLength; i++) {
                                            var graphic_1 = config_1.graphicsLayer.graphics.getItemAt(i);
                                            var uid = graphic_1.uid;
                                            var areaRadius = 10000;
                                            var windAngle = 260;
                                            if (!config.states.has(uid)) {
                                                var verticalOffset = 1000 * Math.random();
                                                var horizontalOffset_1 = Math.random() - 0.5;
                                                var courseOffset = 120 * Math.random() - 60;
                                                var startOffset_2 = areaRadius * Math.random();
                                                var speed_2 = 500 + 250 * Math.random();
                                                var x1_2 = config.camera.position.x + areaRadius * (Math.cos((windAngle + 90 + courseOffset) / 180 * Math.PI) + Math.cos(windAngle / 180 * Math.PI) * horizontalOffset_1);
                                                var y1_2 = config.camera.position.y + areaRadius * (Math.sin((windAngle + 90 + courseOffset) / 180 * Math.PI) + Math.sin(windAngle / 180 * Math.PI) * horizontalOffset_1);
                                                var x2_2 = config.camera.position.x + areaRadius * (Math.cos((windAngle - 90 + courseOffset) / 180 * Math.PI) + Math.cos(windAngle / 180 * Math.PI) * horizontalOffset_1);
                                                var y2_2 = config.camera.position.y + areaRadius * (Math.sin((windAngle - 90 + courseOffset) / 180 * Math.PI) + Math.sin(windAngle / 180 * Math.PI) * horizontalOffset_1);
                                                var lineLength = Math.sqrt(Math.pow(x2_2 - x1_2, 2) + Math.pow(y2_2 - y1_2, 2));
                                                config.states.set(uid, {
                                                    verticalOffset: verticalOffset,
                                                    horizontalOffset: horizontalOffset_1,
                                                    courseOffset: courseOffset,
                                                    startOffset: startOffset_2,
                                                    speed: speed_2,
                                                    x1: x1_2,
                                                    y1: y1_2,
                                                    x2: x2_2,
                                                    y2: y2_2,
                                                    lineLength: lineLength,
                                                    symbol: null
                                                });
                                            }
                                            var state = config.states.get(uid);
                                            var x1 = state.x1, y1 = state.y1, x2 = state.x2, y2 = state.y2, speed = state.speed, startOffset = state.startOffset, horizontalOffset = state.horizontalOffset;
                                            var distance = (Date.now() - config.start) / 1000 * speed + startOffset;
                                            var fraction = (distance % length) / length;
                                            var clone = graphic_1.geometry.clone();
                                            clone.x = x1 + fraction * (x2 - x1);
                                            clone.y = y1 + fraction * (y2 - y1);
                                            clone.z = config.altitude + horizontalOffset;
                                            graphic_1.geometry = clone;
                                            if (graphic_1.symbol && (!state.symbol || state.symbol !== graphic_1.symbol)) {
                                                var symbol = graphic_1.symbol.clone();
                                                var symbolLayer = symbol.symbolLayers.getItemAt(0);
                                                symbolLayer.heading = 360 - Math.atan2(y2 - y1, x2 - x1) / Math.PI * 180 + 90;
                                                graphic_1.symbol = symbol;
                                                state.symbol = symbol;
                                            }
                                        }
                                        // --
                                        var camera = view.camera.clone();
                                        var graphic = config_1.graphicsLayer.graphics.getItemAt(0);
                                        var geometry = graphic.geometry;
                                        camera.position.x = geometry.x + config.distance * Math.cos(ticks / config.speed);
                                        camera.position.y = geometry.y + config.distance * Math.sin(ticks / config.speed);
                                        camera.position.z = geometry.z + 1000 + 50 * Math.cos(ticks / config.speed / 1.23456789);
                                        camera.heading = 360 - (ticks / config.speed / Math.PI * 180) - 90;
                                        camera.tilt = 90 - Math.atan(config.altitude / config.distance) / Math.PI * 180;
                                        view.environment.lighting = {
                                            date: new Date(config.start - ticks * config.speed * 100),
                                            directShadowsEnabled: false,
                                            ambientOcclusionEnabled: false
                                        };
                                        view.camera = camera;
                                    }
                                }];
                            // start
                            view.ui.components = [];
                            controller = new Controller_1.Controller({ controlGroups: controlGroups });
                            view.ui.add(controller, "manual");
                            generator = new Generator_1.Generator({ graphicsLayer: config_1.graphicsLayer, resources: config_1.graphicsLayerResources, cb: function (name) {
                                    _this.loadDefaultLayers(name);
                                    if (name === "tree") {
                                        _this.featureLayerView && (_this.featureLayerView.filter = null);
                                        _this.sceneLayerView && (_this.sceneLayerView.filter = null);
                                    }
                                    if (name === "airplane") {
                                        config_1.graphicsLayer.elevationInfo = {
                                            mode: "absolute-height"
                                        };
                                    }
                                    else {
                                        config_1.graphicsLayer.elevationInfo = {
                                            mode: "relative-to-scene"
                                        };
                                    }
                                    var scenario = animationScenarios.find(function (scenario) { return scenario.name === name; });
                                    if (!scenario) {
                                        scenario = animationScenarios[1];
                                    }
                                    animator.scenario = scenario;
                                    if (!animator.cameraEnabled) {
                                        animator.startCamera();
                                    }
                                } });
                            view.ui.add(generator, "manual");
                            resourceInfo = new ResourceInfo_1.ResourceInfo({ view: view });
                            view.ui.add(resourceInfo, "manual");
                            performanceInfoInfo = new PerformanceInfo_1.PerformanceInfo();
                            view.ui.add(performanceInfoInfo, "manual");
                            return [4 /*yield*/, view.when()];
                        case 1:
                            _b.sent();
                            window.view = view;
                            this.animator.scenario = animationScenarios[0];
                            animator.startCamera();
                            view.on("click", function (event) {
                                console.log("mapPoint", JSON.stringify(event.mapPoint, null, 2));
                            });
                            return [2 /*return*/];
                    }
                });
            });
        };
        Demo.prototype.loadDefaultLayers = function (name) {
            var view = this.view;
            if (!this.hasLayers([config_1.normalElevationLayer, config_1.exaggeratedElevationLayer])) {
                view.map.ground.layers.add(config_1.normalElevationLayer);
            }
            if (!this.hasLayers([config_1.imageTileLayer, config_1.vectorTileLayer])) {
                view.map.basemap.baseLayers.add(config_1.imageTileLayer);
            }
            if (!this.hasLayers([config_1.featureLayer])) {
                view.map.layers.add(config_1.featureLayer);
                watchUtils.once(this, "featureLayerView", function (lv) {
                    lv.filter = config_1.featureLayerFeatureFilter;
                });
            }
            if (!this.hasLayers([config_1.sceneLayer])) {
                view.map.layers.add(config_1.sceneLayer);
                watchUtils.once(this, "sceneLayerView", function (lv) {
                    lv.filter = config_1.sceneLayerFeatureFilter;
                });
            }
        };
        Demo.prototype.getLayerCollection = function (layer) {
            if (!this.view || !this.view.ready) {
                return null;
            }
            switch (layer.type) {
                case "feature":
                case "scene":
                    return this.view.map.layers;
                case "tile":
                case "vector-tile":
                    return this.view.map.basemap.baseLayers;
                case "elevation":
                case "base-elevation":
                    return this.view.map.ground.layers;
            }
        };
        Demo.prototype.hasLayers = function (layers) {
            for (var _i = 0, layers_1 = layers; _i < layers_1.length; _i++) {
                var layer = layers_1[_i];
                var layerCollection = this.getLayerCollection(layer);
                if (layerCollection && layerCollection.indexOf(layer) > -1) {
                    return true;
                }
            }
            return false;
        };
        Demo.prototype.findLineSegmentPosition = function (lengths, distance) {
            var length = 0;
            for (var j = 0; j < config_1.carAnimationLine.length; j++) {
                if (length + lengths[j] > distance) {
                    var fraction = (distance - length) / config_1.carAnimationLineSegmentLengths[j];
                    return {
                        x: config_1.carAnimationLine[j - 1][0],
                        y: config_1.carAnimationLine[j - 1][1],
                        dx: fraction * (config_1.carAnimationLine[j][0] - config_1.carAnimationLine[j - 1][0]),
                        dy: fraction * (config_1.carAnimationLine[j][1] - config_1.carAnimationLine[j - 1][1]),
                        idx: j
                    };
                }
                length += config_1.carAnimationLineSegmentLengths[j];
            }
        };
        __decorate([
            decorators_1.property()
        ], Demo.prototype, "viewDiv", void 0);
        __decorate([
            decorators_1.property()
        ], Demo.prototype, "view", void 0);
        __decorate([
            decorators_1.property()
        ], Demo.prototype, "sceneLayerView", void 0);
        __decorate([
            decorators_1.property()
        ], Demo.prototype, "featureLayerView", void 0);
        __decorate([
            decorators_1.property()
        ], Demo.prototype, "animator", void 0);
        Demo = __decorate([
            decorators_1.subclass()
        ], Demo);
        return Demo;
    }(decorators_1.declared(Accessor)));
    return Demo;
});
