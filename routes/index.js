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

'use strict';

var path = require('path'),
    fs = require('fs'),
    fileExists = require('../lib/fileexists'),
    router = require('express').Router();

/* GET home page. */
router.get(['/test'], function (ignore, res) {
    var apps = require('../lib/getapps')();
    res.render('index.pug', {
        apps: apps,
        app: apps.length >= 1
            ? apps[0]
            : null,
        currentAppName: apps.length >= 1
            ? apps[0].name
            : null,
        action: 'home'
    });
});

router.get('/test/:appname/:action', function (req, res) {
    var getApps = require('../lib/getapps');
    var params = {
        apps: getApps(),
        app: getApps(req.params.appname),
        currentAppName: req.params.appname,
        action: req.params.action
    };
    var appServer = require('../server').apps[req.params.appname];  // must require late as apps does not exist on start
    try {
        params[req.params.action] = appServer.exports[req.params.action]();
    } catch (exc) {
        params[req.params.action] = 'Problem accessing Action "' + req.params.action + '":\n' + exc.message;
    }
    res.render('index.pug', params);
});

router.get('/test/:appname', function (req, res) {
    var getApps = require('../lib/getapps');
    res.render('index.pug', {
        apps: getApps(),
        app: getApps(req.params.appname),
        currentAppName: req.params.appname,
        action: 'home'
    });
});

var mime = {
    gif: 'image/gif',
    jpg: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml'
};

router.get('/apps/:appname/images/:image', function (req, res) {
    var server = require('../server');  // must require late as apps does not exist on start
    var iconPath = path.join(__dirname, '../' + server.config.app_dir, req.params.appname, 'images', req.params.image);
    var mimeType = mime[path.extname(iconPath).slice(1)];

    // Only serve existing image files
    if (!fileExists(iconPath) || !mimeType) {
        return res.status(404).end('Not found');
    }

    var stream = fs.createReadStream(iconPath);
    stream.on('open', function () {
        res.set('Content-Type', mimeType);
        stream.pipe(res);
    });
    stream.on('error', function () {
        res.set('Content-Type', 'text/plain');
        res.status(404).end('Not found');
    });
});


module.exports = router;
