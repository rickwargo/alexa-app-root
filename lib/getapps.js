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

var getIconPath = require('./geticonpath'),
    uuid = require('uuid').v4,
    RandomUserId = require('./randomuserid')();

/**
 * Sort intent names such that the Amazon standard intents are at the bottom of the list.
 * @param {string} a first/left intent name to compare
 * @param {string} b second/right intent name to compare
 * @returns {number} if 0, intent names are the same; if < 0 then a < b; if > 0 then b > a
 */
function sortIntents(a, b) {
    if (a.slice(0, 7).toUpperCase() === 'AMAZON.' && b.slice(0, 7).toUpperCase() === 'AMAZON.') {
        return a.toLowerCase() < b.toLowerCase()
            ? -1
            : (a.toLowerCase() === b.toLowerCase()
                ? 0
                : 1);
    } else if (a.slice(0, 7).toUpperCase() === 'AMAZON.') {
        return 1;
    } else if (b.slice(0, 7).toUpperCase() === 'AMAZON.') {
        return -1;
    } else {
        return a.toLowerCase() < b.toLowerCase()
            ? -1
            : (a.toLowerCase() === b.toLowerCase()
                ? 0
                : 1);
    }
}

/**
 * Sorts intent names such that the Amazon standard intents are at the end of the list (and sorted)
 * @param intents List if intent names in random order
 * @returns {Array.<string>} sorted list of intent names with Amazon standard intents at bottom of list (sorted)
 */
function intentNames(intents) {
    var list = [];

    Object.keys(intents).forEach(function (intent) {
        list.push(intent);
    });

    return list.sort(sortIntents);
}

/**
 * Returns information about a single app or a list of apps
 * @param appName single or list of apps to get data about
 * @returns {Array} information about the supplie app or list of apps
 */
function getApps(appName) {
    var server = require('../server'),
        app,
        apps = [];

    Object.keys(server.apps).forEach(function (name) {
        if (!appName || name === appName) {
            app = server.apps[name];
            apps.push({
                name: app.name,
                description: app.description,
                appId: app.exports.id,
                version: app.version,
                intents: app.exports.intents,
                intentList: intentNames(app.exports.intents),
                icon: getIconPath(name, '../' + server.config.app_dir),
                userId: 'amzn1.ask.account.' + RandomUserId,
                sessionId: 'sessionId.' + uuid(),
                requestId: 'amzn1.echo-api.request.' + uuid(),
                locale: 'en-US'
            });
        }
    });

    return appName
        ? apps[0]
        : apps;
}

module.exports = getApps;
