"use strict";
var Errors = require("./Errors");
var Fragment = require("./Fragment");
var JSONLDConverter_1 = require("./JSONLDConverter");
var NamedFragment = require("./NamedFragment");
var ObjectSchema = require("./ObjectSchema");
var Pointer = require("./Pointer");
var RDF = require("./RDF");
var Resource = require("./Resource");
var Utils = require("./Utils");
function hasPointer(id) {
    var document = this;
    if (id === document.id)
        return true;
    if (!document.inScope(id))
        return false;
    return document.hasFragment(id);
}
function getPointer(id) {
    var document = this;
    if (!document.inScope(id))
        return null;
    if (id === document.id)
        return document;
    var fragment = document.getFragment(id);
    fragment = !fragment ? document.createFragment(id) : fragment;
    return fragment;
}
function inScope(idOrPointer) {
    var document = this;
    var id = Pointer.Factory.is(idOrPointer) ? idOrPointer.id : idOrPointer;
    if (id === document.id)
        return true;
    if (RDF.URI.Util.isBNodeID(id))
        return true;
    if (RDF.URI.Util.isFragmentOf(id, document.id))
        return true;
    return RDF.URI.Util.isRelative(id);
}
function hasFragment(id) {
    var document = this;
    if (RDF.URI.Util.isAbsolute(id)) {
        if (!RDF.URI.Util.isFragmentOf(id, document.id))
            return false;
        id = RDF.URI.Util.hasFragment(id) ? RDF.URI.Util.getFragment(id) : id;
    }
    else if (Utils.S.startsWith(id, "#"))
        id = id.substring(1);
    return document._fragmentsIndex.has(id);
}
function getFragment(id) {
    var document = this;
    if (!RDF.URI.Util.isBNodeID(id))
        return document.getNamedFragment(id);
    return document._fragmentsIndex.get(id) || null;
}
function getNamedFragment(id) {
    var document = this;
    if (RDF.URI.Util.isBNodeID(id))
        throw new Errors.IllegalArgumentError("Named fragments can't have a id that starts with '_:'.");
    if (RDF.URI.Util.isAbsolute(id)) {
        if (!RDF.URI.Util.isFragmentOf(id, document.id))
            throw new Errors.IllegalArgumentError("The id is out of scope.");
        id = RDF.URI.Util.hasFragment(id) ? RDF.URI.Util.getFragment(id) : id;
    }
    else if (Utils.S.startsWith(id, "#"))
        id = id.substring(1);
    return document._fragmentsIndex.get(id) || null;
}
function getFragments() {
    var document = this;
    return Utils.A.from(document._fragmentsIndex.values());
}
function createFragment(slug) {
    if (slug === void 0) { slug = null; }
    var document = this;
    var id;
    if (slug) {
        if (!RDF.URI.Util.isBNodeID(slug))
            return document.createNamedFragment(slug);
        id = slug;
        if (this._fragmentsIndex.has(id))
            throw new Errors.IDAlreadyInUseError("The slug provided is already being used by a fragment.");
    }
    else {
        id = Fragment.Util.generateID();
    }
    var fragment = Fragment.Factory.create(id, document);
    document._fragmentsIndex.set(id, fragment);
    return fragment;
}
function createNamedFragment(slug) {
    var document = this;
    if (RDF.URI.Util.isBNodeID(slug))
        throw new Errors.IllegalArgumentError("Named fragments can't have a slug that starts with '_:'.");
    if (RDF.URI.Util.isAbsolute(slug)) {
        if (!RDF.URI.Util.isFragmentOf(slug, document.id))
            throw new Errors.IllegalArgumentError("The slug is out of scope.");
        slug = RDF.URI.Util.hasFragment(slug) ? RDF.URI.Util.getFragment(slug) : slug;
    }
    else if (Utils.S.startsWith(slug, "#"))
        slug = slug.substring(1);
    if (document._fragmentsIndex.has(slug))
        throw new Errors.IDAlreadyInUseError("The slug provided is already being used by a fragment.");
    var fragment = NamedFragment.Factory.create(slug, document);
    document._fragmentsIndex.set(slug, fragment);
    return fragment;
}
function removeFragment(fragmentOrSlug) {
    var document = this;
    var id = Utils.isString(fragmentOrSlug) ? fragmentOrSlug : fragmentOrSlug.id;
    if (RDF.URI.Util.isAbsolute(id)) {
        if (!RDF.URI.Util.isFragmentOf(id, document.id))
            return;
        id = RDF.URI.Util.hasFragment(id) ? RDF.URI.Util.getFragment(id) : id;
    }
    else if (Utils.S.startsWith(id, "#"))
        id = id.substring(1);
    document._fragmentsIndex.delete(id);
}
function toJSON(objectSchemaResolver, jsonldConverter) {
    if (objectSchemaResolver === void 0) { objectSchemaResolver = null; }
    if (jsonldConverter === void 0) { jsonldConverter = null; }
    jsonldConverter = !!jsonldConverter ? jsonldConverter : new JSONLDConverter_1.default();
    var resources = [];
    resources.push(this);
    resources = resources.concat(this.getFragments());
    var expandedResources = [];
    for (var _i = 0, resources_1 = resources; _i < resources_1.length; _i++) {
        var resource = resources_1[_i];
        var digestedContext = objectSchemaResolver ? objectSchemaResolver.getSchemaFor(resource) : new ObjectSchema.DigestedObjectSchema();
        expandedResources.push(jsonldConverter.expand(resource, digestedContext, this));
    }
    var graph = {
        "@id": this.id,
        "@graph": expandedResources,
    };
    return JSON.stringify(graph);
}
var Factory = (function () {
    function Factory() {
    }
    Factory.hasClassProperties = function (documentResource) {
        return (Utils.isObject(documentResource) &&
            Utils.hasPropertyDefined(documentResource, "_fragmentsIndex") &&
            Utils.hasFunction(documentResource, "hasFragment") &&
            Utils.hasFunction(documentResource, "getFragment") &&
            Utils.hasFunction(documentResource, "getNamedFragment") &&
            Utils.hasFunction(documentResource, "getFragments") &&
            Utils.hasFunction(documentResource, "createFragment") &&
            Utils.hasFunction(documentResource, "createNamedFragment") &&
            Utils.hasFunction(documentResource, "removeFragment") &&
            Utils.hasFunction(documentResource, "toJSON"));
    };
    Factory.create = function (uri) {
        if (uri === void 0) { uri = null; }
        return Factory.createFrom({}, uri);
    };
    Factory.createFrom = function (object, uri) {
        if (uri === void 0) { uri = null; }
        if (!!uri && RDF.URI.Util.isBNodeID(uri))
            throw new Errors.IllegalArgumentError("Documents cannot have a BNodeID as a uri.");
        var resource = Resource.Factory.createFrom(object, uri);
        var document = Factory.decorate(resource);
        return document;
    };
    Factory.decorate = function (object) {
        if (Factory.hasClassProperties(object))
            return object;
        Object.defineProperties(object, {
            "_fragmentsIndex": {
                writable: false,
                enumerable: false,
                configurable: true,
                value: new Map(),
            },
            "hasPointer": {
                writable: true,
                enumerable: false,
                configurable: true,
                value: hasPointer,
            },
            "getPointer": {
                writable: true,
                enumerable: false,
                configurable: true,
                value: getPointer,
            },
            "inScope": {
                writable: true,
                enumerable: false,
                configurable: true,
                value: inScope,
            },
            "hasFragment": {
                writable: true,
                enumerable: false,
                configurable: true,
                value: hasFragment,
            },
            "getFragment": {
                writable: true,
                enumerable: false,
                configurable: true,
                value: getFragment,
            },
            "getNamedFragment": {
                writable: true,
                enumerable: false,
                configurable: true,
                value: getNamedFragment,
            },
            "getFragments": {
                writable: true,
                enumerable: false,
                configurable: true,
                value: getFragments,
            },
            "createFragment": {
                writable: true,
                enumerable: false,
                configurable: true,
                value: createFragment,
            },
            "createNamedFragment": {
                writable: true,
                enumerable: false,
                configurable: true,
                value: createNamedFragment,
            },
            "removeFragment": {
                writable: true,
                enumerable: false,
                configurable: true,
                value: removeFragment,
            },
            "toJSON": {
                writable: true,
                enumerable: false,
                configurable: true,
                value: toJSON,
            },
        });
        return object;
    };
    return Factory;
}());
exports.Factory = Factory;

//# sourceMappingURL=Document.js.map
