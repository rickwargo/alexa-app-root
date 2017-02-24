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

/*jslint node: true */
/*global describe */
/*global it */

'use strict';

var chai = require('chai'),
    chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
chai.should();


////////////// Base Tests //////////////

describe('AlexaAppServer', function () {
    describe('config', function () {
        var appServer = require('../server');
        it('has a server_dir property value of "server" when instantiated', function () {
            appServer.config.server_dir.should.equal('server');
        });

        it('has a privateKey property value of "private-key.pem" when instantiated', function () {
            appServer.config.privateKey.should.equal('private-key.pem');
        });

        it('has a certificate property value of "server" when instantiated', function () {
            appServer.config.certificate.should.equal('cert.cer');
        });
    });
});