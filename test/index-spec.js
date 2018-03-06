'use strict';

const assert = require('assert');
const index = require('../index');

describe('index', function() {
    describe('#cors()', function() {
        let handler = function(event, context, callback) {
            let res = {statusCode: 200, body: 'Hello'};
            callback(null, res);
        };

        it('should have CORS headers when it does not have any options', function(done) {
            let event = {
                httpMethod: 'GET'
            };
            let context = {};


            index.cors(handler)(event, context, function(err, res) {
                console.log('res:', res);
                assert.notEqual(res.headers, null);
                done();
            });
        });

        it('should have CORS headers when it provides options', function(done) {
            let event = {
                httpMethod: 'GET'
            };
            let context = {};
            let options = {
                origins: [], 
                allowCredentials: false,
                allowMethod: ['*'],
                maxAge: null
            };

            index.cors(handler, options)(event, context, function(err, res) {
                console.log('res:', res);
                assert.notEqual(res.headers, null);
                done();
            });
        });

        it('should have CORS header when it has origin', function(done) {
            let event = {
                httpMethod: 'GET',
                headers: {
                    origin: 'https://www.nuskin.com'
                }
            };
            let context = {};
            let options = {
                origins: ['https://www.nuskin.com'], 
                // origins: ["https://www.nuskin.com", "https://test.nuskin.com", "https://dev.nuskin.com"],
                allowCredentials: false,
                allowMethod: ['*'],
                maxAge: null
            };

            index.cors(handler, options)(event, context, function(err, res) {
                console.log('res:', res);
                assert.notEqual(res.headers, null);
                done();
            });
        });
    });
});
