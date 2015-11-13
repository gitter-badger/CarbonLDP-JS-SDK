/// <reference path="../../typings/es6/es6.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var NS = require("./../NS");
var Container = require("./Container");
var Utils = require("./../Utils");
var RDF_CLASS = NS.LDP.Class.BasicContainer;
var Factory = (function (_super) {
    __extends(Factory, _super);
    function Factory() {
        _super.apply(this, arguments);
    }
    Factory.prototype.is = function (object) {
        return (_super.prototype.is.call(this, object) &&
            this.hasRDFClass(object) &&
            this.hasClassProperties(object));
    };
    Factory.prototype.from = function (resourceOrResources) {
        var sources = _super.prototype.from.call(this, resourceOrResources);
        var resources = Utils.isArray(sources) ? sources : [sources];
        for (var i = 0, length_1 = resources.length; i < length_1; i++) {
            var resource = resources[i];
            if (!this.hasClassProperties(resource))
                this.injectBehaviour(resource);
        }
        if (Utils.isArray(resourceOrResources))
            return resources[0];
        return resources;
    };
    Factory.prototype.hasRDFClass = function (resource) {
        return (resource.types.indexOf(NS.LDP.Class.BasicContainer) !== -1);
    };
    Factory.prototype.hasClassProperties = function (resource) {
        return true;
    };
    Factory.prototype.injectBehaviour = function (resource) {
        return resource;
    };
    return Factory;
})(Container.Factory);
exports.Factory = Factory;
exports.factory = new Factory();

//# sourceMappingURL=BasicContainer.js.map