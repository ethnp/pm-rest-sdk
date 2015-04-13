/**
 * Created by ethan on 4/7/15.
 */
define(function(require){
    'use strict';
    //var Ajax = require('Ajax');
    //console.log('hello');
    var AjaxClass = require('Ajax');
    var Ajax = new AjaxClass();
    //console.log(AjaxClass);
    //console.log(Ajax);

    describe('Ajax module testing suite', function(){
        beforeEach(function(){
            if(typeof Ajax.args !== 'undefined') delete Ajax.args;
        });
        it('Ajax class Should be defined', function(){
            expect(Ajax).toBeDefined();
        });
        it('Constructor should return instance of class', function(){
            var newAjax = Ajax.constructor();
            expect(newAjax).toEqual(Ajax);
        });
        it('Config function should be chainable', function(){
            expect(Ajax.config({url: 'example.app.json', isLocal: true})).toEqual(Ajax);
        });
        it('Call function should be chainable if a callback function is specified', function(){
            expect(Ajax.config({url: 'example.app.json', isLocal: true}).call(function(response){

            })).toEqual(Ajax);
        });
        it('Call function should not be chainable if a callback function is NOT specified', function(){
            expect(Ajax.config({url: 'example.app.json', isLocal: true}).call()).not.toEqual(Ajax);
        });
        it('MakeCall function should be chainable if a callback function is specified', function(){
            expect(Ajax.makeCall({url: 'example.app.json', isLocal: true}, function(response){

            })).toEqual(Ajax);
        });
        it('MakeCall function should not be chainable if a callback function is NOT specified', function(){
            expect(Ajax.makeCall({url: 'example.app.json', isLocal: true})).not.toEqual(Ajax);
        });
        it('Config function should handle if certain options are not specified in the Ajax object that is passed', function(){
            var config = Ajax.config({url: 'example.app.json'});
            expect(config).toEqual(Ajax);
            expect(Ajax.args).toBeDefined();
            expect(Ajax.args.async).toEqual(false);
            expect(Ajax.args.method).toEqual('GET');
            expect(Ajax.args.contentType).toEqual('application/json');
            expect(Ajax.args.isLocal).toEqual(false);
        });
        it('Config function should return an error message for the url parameter if the url parameter is not defined', function(){
            var config = Ajax.config({});
            expect(Ajax.args.url).toEqual('No URL defined.');
        });
        it('Call function should return a response', function(){
            var response = Ajax.config({url: 'example.app.json', isLocal: true}).call();
            expect(response).toEqual({
                "server" : "http://pm",
                "workspace" : "workflow",
                "clientId" : "NYNRYVNKKNYGUYNGURAAKCWCRLUQEPKS",
                "clientSecret" : "5519814215526ca9ebd4a93002540483",
                "redirectUri" : "http://localhost",
                "grantType" : "authorization_code",
                "scope" : "view_processes edit_processes"
            });
        });
        it('MakeCall function should return a response', function(){
            var response = Ajax.makeCall({url: 'example.app.json', isLocal: true});
            expect(response).toEqual({
                "server" : "http://pm",
                "workspace" : "workflow",
                "clientId" : "NYNRYVNKKNYGUYNGURAAKCWCRLUQEPKS",
                "clientSecret" : "5519814215526ca9ebd4a93002540483",
                "redirectUri" : "http://localhost",
                "grantType" : "authorization_code",
                "scope" : "view_processes edit_processes"
            });
        });
        it('Call function should return error message if called without calling config before', function () {
            var response = Ajax.call();
            expect(response).toEqual('Config object is not set.');
        });
        it('Call function should return error message if called with an empty object passed to config function', function () {
            var response = Ajax.config({}).call();
            expect(response).toEqual('No URL defined.');
        });
    });
});