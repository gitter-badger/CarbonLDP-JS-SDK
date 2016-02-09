/// <reference path="./../../typings/typings.d.ts" />
System.register(["./Errors", "./Header", "./Method", "./Response", "./../Utils"], function(exports_1) {
    var Errors, Header, Method_1, Response_1, Utils;
    var Service, Util;
    function setHeaders(request, headers) {
        var namesIterator = headers.keys();
        var next = namesIterator.next();
        while (!next.done) {
            var name_1 = next.value;
            var value = headers.get(name_1);
            request.setRequestHeader(name_1, value.toString());
            next = namesIterator.next();
        }
    }
    function onLoad(resolve, reject, request) {
        return function () {
            var response = new Response_1.default(request);
            if (request.status >= 200 && request.status <= 299) {
                resolve(response);
            }
            else {
                rejectRequest(reject, request);
            }
        };
    }
    function onError(reject, request) {
        return function () {
            rejectRequest(reject, request);
        };
    }
    function rejectRequest(reject, request) {
        var response = new Response_1.default(request);
        if (response.status >= 400 && response.status < 600) {
            if (Errors.statusCodeMap.has(response.status)) {
                var error = Errors.statusCodeMap.get(response.status);
                // TODO: Set error message
                reject(new error("", response));
            }
        }
        reject(new Errors.UnknownError("", response));
    }
    return {
        setters:[
            function (Errors_1) {
                Errors = Errors_1;
            },
            function (Header_1) {
                Header = Header_1;
            },
            function (Method_1_1) {
                Method_1 = Method_1_1;
            },
            function (Response_1_1) {
                Response_1 = Response_1_1;
            },
            function (Utils_1) {
                Utils = Utils_1;
            }],
        execute: function() {
            Service = (function () {
                function Service() {
                }
                Service.send = function (method, url, bodyOrOptions, options, parser) {
                    if (bodyOrOptions === void 0) { bodyOrOptions = Service.defaultOptions; }
                    if (options === void 0) { options = Service.defaultOptions; }
                    if (parser === void 0) { parser = null; }
                    var body = bodyOrOptions && Utils.isString(bodyOrOptions) ? bodyOrOptions : null;
                    options = !bodyOrOptions || Utils.isString(bodyOrOptions) ? options : bodyOrOptions;
                    options = options ? options : {};
                    options = Utils.extend(options, Service.defaultOptions);
                    if (Utils.isNumber(method))
                        method = Method_1.default[method];
                    var requestPromise = new Promise(function (resolve, reject) {
                        var request = options.request ? options.request : new XMLHttpRequest();
                        request.open(method, url, true);
                        if (options.headers)
                            setHeaders(request, options.headers);
                        request.withCredentials = options.sendCredentialsOnCORS;
                        if (options.timeout)
                            request.timeout = options.timeout;
                        request.onload = onLoad(resolve, reject, request);
                        request.onerror = onError(reject, request);
                        if (body) {
                            request.send(body);
                        }
                        else {
                            request.send();
                        }
                    });
                    if (parser === null)
                        return requestPromise;
                    return requestPromise.then(function (response) {
                        return parser.parse(response.data).then(function (parsedBody) {
                            return [parsedBody, response];
                        });
                    });
                };
                Service.options = function (url, options) {
                    if (options === void 0) { options = Service.defaultOptions; }
                    return Service.send(Method_1.default.OPTIONS, url, options);
                };
                Service.head = function (url, options) {
                    if (options === void 0) { options = Service.defaultOptions; }
                    return Service.send(Method_1.default.HEAD, url, options);
                };
                Service.get = function (url, options, parser) {
                    if (options === void 0) { options = Service.defaultOptions; }
                    if (parser === void 0) { parser = null; }
                    return Service.send(Method_1.default.GET, url, null, options, parser);
                };
                Service.post = function (url, bodyOrOptions, options, parser) {
                    if (bodyOrOptions === void 0) { bodyOrOptions = Service.defaultOptions; }
                    if (options === void 0) { options = Service.defaultOptions; }
                    if (parser === void 0) { parser = null; }
                    return Service.send(Method_1.default.POST, url, bodyOrOptions, options, parser);
                };
                Service.put = function (url, bodyOrOptions, options, parser) {
                    if (bodyOrOptions === void 0) { bodyOrOptions = Service.defaultOptions; }
                    if (options === void 0) { options = Service.defaultOptions; }
                    if (parser === void 0) { parser = null; }
                    return Service.send(Method_1.default.PUT, url, bodyOrOptions, options, parser);
                };
                Service.patch = function (url, bodyOrOptions, options, parser) {
                    if (bodyOrOptions === void 0) { bodyOrOptions = Service.defaultOptions; }
                    if (options === void 0) { options = Service.defaultOptions; }
                    if (parser === void 0) { parser = null; }
                    return Service.send(Method_1.default.PATCH, url, bodyOrOptions, options, parser);
                };
                Service.delete = function (url, bodyOrOptions, options, parser) {
                    if (bodyOrOptions === void 0) { bodyOrOptions = Service.defaultOptions; }
                    if (options === void 0) { options = Service.defaultOptions; }
                    if (parser === void 0) { parser = null; }
                    return Service.send(Method_1.default.DELETE, url, bodyOrOptions, options, parser);
                };
                Service.defaultOptions = {
                    sendCredentialsOnCORS: true
                };
                return Service;
            })();
            exports_1("Service", Service);
            Util = (function () {
                function Util() {
                }
                Util.setAcceptHeader = function (accept, requestOptions) {
                    var headers = requestOptions.headers ? requestOptions.headers : requestOptions.headers = new Map();
                    headers.set("Accept", new Header.Class(accept));
                    return requestOptions;
                };
                Util.setContentTypeHeader = function (contentType, requestOptions) {
                    var headers = requestOptions.headers ? requestOptions.headers : requestOptions.headers = new Map();
                    headers.set("Content-Type", new Header.Class(contentType));
                    return requestOptions;
                };
                Util.setIfMatchHeader = function (etag, requestOptions) {
                    var headers = requestOptions.headers ? requestOptions.headers : requestOptions.headers = new Map();
                    headers.set("If-Match", new Header.Class(etag));
                    return requestOptions;
                };
                Util.setPreferredInteractionModel = function (interactionModelURI, requestOptions) {
                    var headers = requestOptions.headers ? requestOptions.headers : requestOptions.headers = new Map();
                    if (!headers.has("Prefer"))
                        headers.set("Prefer", new Header.Class());
                    var prefer = headers.get("Prefer");
                    prefer.values.push(new Header.Value(interactionModelURI + "; rel=interaction-model"));
                    return requestOptions;
                };
                Util.setSlug = function (slug, requestOptions) {
                    var headers = requestOptions.headers ? requestOptions.headers : requestOptions.headers = new Map();
                    if (!headers.has("Slug"))
                        headers.set("Slug", new Header.Class());
                    var slugHeader = headers.get("Slug");
                    slugHeader.values.push(new Header.Value(slug));
                    return requestOptions;
                };
                return Util;
            })();
            exports_1("Util", Util);
        }
    }
});

//# sourceMappingURL=Request.js.map
