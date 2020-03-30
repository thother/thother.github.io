define(["require", "exports", "esri/core/accessorSupport/decorators", "esri/widgets/Widget", "esri/widgets/support/widget"], function (require, exports, decorators_1, Widget, widget_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var Controller = /** @class */ (function (_super) {
        __extends(Controller, _super);
        //--------------------------------------------------------------------------
        //
        //  Lifecycle
        //
        //--------------------------------------------------------------------------
        function Controller(properties) {
            var _this = _super.call(this) || this;
            //--------------------------------------------------------------------------
            //
            //  Properties
            //
            //--------------------------------------------------------------------------
            _this.controlGroups = null;
            return _this;
        }
        //--------------------------------------------------------------------------
        //
        //  Public Methods
        //
        //--------------------------------------------------------------------------
        Controller.prototype.renderControlNode = function (control) {
            var enabled = control.selected();
            var onclick = function () { return control.select(); };
            return (widget_1.tsx("div", { class: 'button', onclick: onclick },
                widget_1.tsx("span", { class: "icon icon-" + control.icon + " " + (enabled ? "enabled" : "disabled") }),
                widget_1.tsx("span", { class: "description" }, control.caption)));
        };
        Controller.prototype.renderControlGroup = function (controlGroup) {
            var controlNodes = [];
            for (var _i = 0, controlGroup_1 = controlGroup; _i < controlGroup_1.length; _i++) {
                var control = controlGroup_1[_i];
                controlNodes.push(this.renderControlNode(control));
            }
            return (widget_1.tsx("div", null, controlNodes));
        };
        Controller.prototype.render = function () {
            var controlGroupNodes = [];
            for (var _i = 0, _a = this.controlGroups; _i < _a.length; _i++) {
                var controlGroup = _a[_i];
                controlGroupNodes.push(this.renderControlGroup(controlGroup));
            }
            return (widget_1.tsx("div", { id: "resourceController" }, controlGroupNodes));
        };
        __decorate([
            decorators_1.property(),
            widget_1.renderable()
        ], Controller.prototype, "controlGroups", void 0);
        Controller = __decorate([
            decorators_1.subclass("esri.widgets.Controller")
        ], Controller);
        return Controller;
    }(decorators_1.declared(Widget)));
    exports.Controller = Controller;
});
