////////////////////////////////////////////////////////////////////////////////
// Copyright (c) 2015-2016 Rick Wargo. All Rights Reserved.
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
    fileExists = require('./fileexists');

/**
 * Constructs path to icon (unknown app icon if not found) for use in the web page
 * @param appName name of app to get small icon path
 * @param {string} appDir location of the alexa-js apps
 * @returns {*|string} URL to small application icon
 */
function getIconPath(appName, appDir) {
    var iconPath = path.join(__dirname, appDir, appName, 'images', 'icon-small.png');

    if (fileExists(iconPath)) {
        iconPath = path.join('/apps', appName, 'images', 'icon-small.png');
    } else {
        iconPath = '/images/unknown-app.png';
    }

    return iconPath;
}


module.exports = getIconPath;
