"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var HTTPError_1 = require("./HTTPError");
var name = "UnknownError";
var UnknownError = (function (_super) {
    __extends(UnknownError, _super);
    function UnknownError() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(UnknownError.prototype, "name", {
        get: function () { return name; },
        enumerable: true,
        configurable: true
    });
    return UnknownError;
}(HTTPError_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = UnknownError;

//# sourceMappingURL=UnknownError.js.map
