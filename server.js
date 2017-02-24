////////////////////////////////////////////////////////////////////////////////
// Copyright (c) 2015-2017 Rick Wargo. All Rights Reserved.
//
// Licensed under the MIT License (the "License"). You may not use this file
// except in compliance with the License. A copy of the License is located at
// http://opensource.org/licenses/MIT or in the "LICENSE" file accompanying
// this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES
// OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.
////////////////////////////////////////////////////////////////////////////////

/*jslint node: true */
'use strict';
var AlexaAppServer = require('alexa-app-server');
var routes = require('./routes/index');

// For parameter docs, see: https://github.com/alexa-js/alexa-app-server/

var config = {
    // In order to start the server from a working directory other than
    // where your server.js file, you need to provide Node the full path
    // to your server's root directory. The easiest way is to use  __dirname
    server_root: __dirname,

    // A directory containing static content to serve as the document root.
    // This directory is relative to the script using alexa-app-server, not
    // relative to the module directory.
    public_html: "public_html",

    // A directory containing Alexa Apps. This directory should contain one
    // or more subdirectories. Each subdirectory is a stand-alone Alexa App
    // built with the alexa-app framework. These directories are each
    // processed during server startup and hooked into the server.
    app_dir: "../alexa-js-apps/",

    // The prefix to use for all Alexa Apps. For example, you may want all
    // your Alexa endpoints to be accessed under the "/api" path off the
    // root of your web server.
    app_root: "/alexa",

    // The directory containing server-side processing modules (see below)
    server_dir: "server",

    // The port the server should bind to
    port: 8003,
    // Enables https support. Note privateKey, and certificate are needed.

    // The https port the server will bind to. No default. Must be set if httpsEnable = true
    httpsPort: 8443,

    httpEnabled: true,
    httpsEnabled: true,

    // By default, GET requests to Alexa App endpoints will show the
    // debugger UI. This can be disabled.
    debug: true,

    // By default, some information is logged with console.log(), which can be disabled
    log: true,

    // This will add verification for alexa requests as required by the alexa certification
    // process. Provided by alexa-verifier
    verify: false,

    // The pre() method is called after the express server has been instantiated,
    // but before and Alexa Apps have been loaded. It is passed the AlexaAppServer
    // object itself.
    pre: function (appServer) {
        if (appServer.config.debug) {
            // Don't display the testing web page id debug == true
            var paths = appServer.express.get('views');
            appServer.express.set('views', [__dirname + '/views', paths]);  // add our views directory to view path
            appServer.express.engine('pug', require('pug').renderFile);     // Should be __express but jslint complains
            appServer.express.locals.pretty = true;  // indent produces HTML for clarity
            appServer.express.use('/', routes);
        }
    },

    // The post() method is called after the server has started and the start() method
    // is ready to exit. It is passed the AlexaAppServer object itself.
    // post: function(appServer) { },

    // Like pre(), but this function is fired on every request, but before the
    // application itself gets called. You can use this to load up user details before
    // every request, for example, and insert it into the json request itself for
    // the application to use.
    // If it returns a falsy value, the request json is not changed.
    // If it returns a non-falsy value, the request json is replaced with what was returned.
    // If it returns a Promise, request processing pauses until the Promise resolves.
    //    The value passed on by the promise (if any) replaces the request json.
    // preRequest: function(json,request,response) { },

    // Like post(), but this function is fired after every request. It has a final
    // opportunity to modify the JSON response before it is returned back to the
    // Alexa service.
    // If it returns a falsy value, the response json is not changed.
    // If it returns a non-falsy value, the response json is replaced with what was returned.
    // If it returns a Promise, response processing pauses until the Promise resolves.
    //    The value passed on by the promise (if any) replaces the response json.
    // postRequest : function(json,request,response) { },

    // privateKey filename. This file must reside in the sslcert folder under the root of the project. Must be set if httpsEnable = true
    privateKey: 'private-key.pem',

    // certificate filename. This file must reside in the sslcert folder under the root of the project. Must be set if httpsEnable = true
    certificate: 'cert.cer'
};

var server = new AlexaAppServer(config);

// pass "--start" on the command line to start the server upon load
if (process.argv.slice(-1)[0].slice(-5).toLowerCase() === 'start') {
    server.start();
}

module.exports = server;
