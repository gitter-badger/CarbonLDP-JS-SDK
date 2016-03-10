System.register(["./Auth"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Auth;
    var settings;
    return {
        setters:[
            function (Auth_1) {
                Auth = Auth_1;
            }],
        execute: function() {
            settings = {};
            settings["domain"] = "carbonldp.com";
            settings["http.ssl"] = true;
            settings["auth.method"] = Auth.Method.TOKEN;
            settings["platform.container"] = "platform/";
            settings["platform.apps.container"] = "apps/";
            exports_1("default",settings);
        }
    }
});

//# sourceMappingURL=settings.js.map
