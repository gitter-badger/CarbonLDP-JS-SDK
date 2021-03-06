"use strict";
var Document = require("./Document");
var PersistedResource = require("./PersistedResource");
var PersistedFragment = require("./PersistedFragment");
var PersistedNamedFragment = require("./PersistedNamedFragment");
var RDF = require("./RDF");
var Utils = require("./Utils");
var URI = require("./RDF/URI");
function extendIsDirty(superFunction) {
    return function () {
        var isDirty = superFunction.call(this);
        if (isDirty)
            return true;
        var document = this;
        for (var _i = 0, _a = document.getFragments(); _i < _a.length; _i++) {
            var fragment = _a[_i];
            if (fragment.isDirty())
                return true;
        }
        for (var _b = 0, _c = document._savedFragments; _b < _c.length; _b++) {
            var fragment = _c[_b];
            if (!document.hasFragment(fragment.id))
                return true;
        }
        return false;
    };
}
function syncSavedFragments() {
    var document = this;
    document._savedFragments = Utils.A.from(document._fragmentsIndex.values());
}
function extendCreateFragment(superFunction) {
    return function (slug) {
        if (slug === void 0) { slug = null; }
        var fragment = superFunction.call(this, slug);
        if (slug !== null) {
            if (RDF.URI.Util.isBNodeID(slug))
                return PersistedFragment.Factory.decorate(fragment);
            return PersistedNamedFragment.Factory.decorate(fragment);
        }
        else {
            return PersistedFragment.Factory.decorate(fragment);
        }
    };
}
function extendCreateNamedFragment(superFunction) {
    return function (slug) {
        var fragment = superFunction.call(this, slug);
        return PersistedFragment.Factory.decorate(fragment);
    };
}
function refresh() {
    return null;
}
function save() {
    return this._documents.save(this);
}
function destroy() {
    return this._documents.delete(this);
}
function executeRawASKQuery(askQuery, requestOptions) {
    if (requestOptions === void 0) { requestOptions = {}; }
    return this._documents.executeRawASKQuery(this.id, askQuery, requestOptions);
}
function executeASKQuery(askQuery, requestOptions) {
    if (requestOptions === void 0) { requestOptions = {}; }
    return this._documents.executeASKQuery(this.id, askQuery, requestOptions);
}
function executeRawSELECTQuery(selectQuery, requestOptions) {
    if (requestOptions === void 0) { requestOptions = {}; }
    return this._documents.executeRawSELECTQuery(this.id, selectQuery, requestOptions);
}
function executeSELECTQuery(selectQuery, requestOptions) {
    if (requestOptions === void 0) { requestOptions = {}; }
    return this._documents.executeSELECTQuery(this.id, selectQuery, requestOptions);
}
function executeRawCONSTRUCTQuery(constructQuery, requestOptions) {
    if (requestOptions === void 0) { requestOptions = {}; }
    return this._documents.executeRawCONSTRUCTQuery(this.id, constructQuery, requestOptions);
}
function executeRawDESCRIBEQuery(describeQuery, requestOptions) {
    if (requestOptions === void 0) { requestOptions = {}; }
    return this._documents.executeRawDESCRIBEQuery(this.id, describeQuery, requestOptions);
}
var Factory = (function () {
    function Factory() {
    }
    Factory.hasClassProperties = function (document) {
        return (Utils.hasPropertyDefined(document, "_documents") &&
            Utils.hasPropertyDefined(document, "_etag") &&
            Utils.hasFunction(document, "refresh") &&
            Utils.hasFunction(document, "save") &&
            Utils.hasFunction(document, "destroy") &&
            Utils.hasFunction(document, "executeRawASKQuery") &&
            Utils.hasFunction(document, "executeASKQuery") &&
            Utils.hasFunction(document, "executeRawSELECTQuery") &&
            Utils.hasFunction(document, "executeSELECTQuery") &&
            Utils.hasFunction(document, "executeRawDESCRIBEQuery") &&
            Utils.hasFunction(document, "executeRawCONSTRUCTQuery"));
    };
    Factory.is = function (object) {
        return Utils.isObject(object)
            && Document.Factory.hasClassProperties(object)
            && Factory.hasClassProperties(object);
    };
    Factory.create = function (uri, documents, snapshot) {
        if (snapshot === void 0) { snapshot = {}; }
        var document = Document.Factory.create(uri);
        return Factory.decorate(document, documents, snapshot);
    };
    Factory.createFrom = function (object, uri, documents, snapshot) {
        if (snapshot === void 0) { snapshot = {}; }
        var document = Document.Factory.createFrom(object, uri);
        return Factory.decorate(document, documents, snapshot);
    };
    Factory.decorate = function (document, documents, snapshot) {
        if (snapshot === void 0) { snapshot = {}; }
        PersistedResource.Factory.decorate(document, snapshot);
        if (Factory.hasClassProperties(document))
            return document;
        var persistedDocument = document;
        Object.defineProperties(persistedDocument, {
            "_documents": {
                writable: false,
                enumerable: false,
                configurable: true,
                value: documents,
            },
            "_etag": {
                writable: true,
                enumerable: false,
                configurable: true,
                value: null,
            },
            "_savedFragments": {
                writable: true,
                enumerable: false,
                configurable: true,
                value: [],
            },
            "_syncSavedFragments": {
                writable: false,
                enumerable: false,
                configurable: true,
                value: syncSavedFragments,
            },
            "hasPointer": {
                writable: false,
                enumerable: false,
                configurable: true,
                value: (function () {
                    var superFunction = persistedDocument.hasPointer;
                    return function (id) {
                        if (superFunction.call(this, id))
                            return true;
                        return !URI.Util.isBNodeID(id) && this._documents.hasPointer(id);
                    };
                })(),
            },
            "getPointer": {
                writable: false,
                enumerable: false,
                configurable: true,
                value: (function () {
                    var superFunction = persistedDocument.getPointer;
                    var inScopeFunction = persistedDocument.inScope;
                    return function (id) {
                        if (inScopeFunction.call(this, id))
                            return superFunction.call(this, id);
                        return this._documents.getPointer(id);
                    };
                })(),
            },
            "inScope": {
                writable: false,
                enumerable: false,
                configurable: true,
                value: (function () {
                    var superFunction = persistedDocument.inScope;
                    return function (idOrPointer) {
                        if (superFunction.call(this, idOrPointer))
                            return true;
                        return this._documents.inScope(idOrPointer);
                    };
                })(),
            },
            "refresh": {
                writable: false,
                enumerable: false,
                configurable: true,
                value: refresh,
            },
            "save": {
                writable: false,
                enumerable: false,
                configurable: true,
                value: save,
            },
            "destroy": {
                writable: false,
                enumerable: false,
                configurable: true,
                value: destroy,
            },
            "executeRawASKQuery": {
                writable: false,
                enumerable: false,
                configurable: true,
                value: executeRawASKQuery,
            },
            "executeASKQuery": {
                writable: false,
                enumerable: false,
                configurable: true,
                value: executeASKQuery,
            },
            "executeRawSELECTQuery": {
                writable: false,
                enumerable: false,
                configurable: true,
                value: executeRawSELECTQuery,
            },
            "executeSELECTQuery": {
                writable: false,
                enumerable: false,
                configurable: true,
                value: executeSELECTQuery,
            },
            "executeRawCONSTRUCTQuery": {
                writable: false,
                enumerable: false,
                configurable: true,
                value: executeRawCONSTRUCTQuery,
            },
            "executeRawDESCRIBEQuery": {
                writable: false,
                enumerable: false,
                configurable: true,
                value: executeRawDESCRIBEQuery,
            },
            "createFragment": {
                writable: false,
                enumerable: false,
                configurable: true,
                value: extendCreateFragment(persistedDocument.createFragment),
            },
            "createNamedFragment": {
                writable: false,
                enumerable: false,
                configurable: true,
                value: extendCreateNamedFragment(persistedDocument.createNamedFragment),
            },
            "isDirty": {
                writable: false,
                enumerable: false,
                configurable: true,
                value: extendIsDirty(persistedDocument.isDirty),
            },
        });
        return persistedDocument;
    };
    return Factory;
}());
exports.Factory = Factory;

//# sourceMappingURL=PersistedDocument.js.map
