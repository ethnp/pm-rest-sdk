/**
 * Created by ethan on 4/6/15.
 */
define(function(require){

    function Ajax(){
        return this;
    }
    Ajax.prototype = {
        args: {},
        config: function(args){
            if(typeof args.async === 'undefined') args.async = false;
            if(typeof args.method === 'undefined') args.method = 'GET';
            if(typeof args.contentType === 'undefined') args.contentType = 'application/json';
            if(typeof args.isLocal === 'undefined') args.isLocal = false;
            args.url = this._getUrl(args.url, args.isLocal);
            this.args = args;
            return this;
        },
        call: function(callback){
            if(typeof this.args === 'undefined' || Object.keys(this.args).length === 0) return 'Config object is not set.';
            if(typeof this.args.url === 'undefined' || this.args.url === 'No URL defined.') return 'No URL defined.';
            //console.log(Object.keys(this.args.length).length);
            this._create();
            var result = this._send();
            if (typeof callback !== 'undefined') callback(result);
            else return result;
            return this;
        },
        makeCall: function(args, callback){
            this.config(args);
            if (typeof callback !== 'undefined') this.call(callback);
            else return this.call();
            return this;
        },
        _getUrl: function(url, isLocal){
            if( typeof isLocal === 'undefined' ) isLocal = false;
            if(typeof url === 'undefined') return 'No URL defined.';
            if( ! isLocal ){
                return ( /http:\/\//i.test(url) || /https:\/\//i.test(url) ) ? url : 'http://' + url;
            }else{
                return url;
            }
        },
        _create: function(){
            //Create XMLHttpRequest object
            this.req = new XMLHttpRequest();
            //Open the object, set the method dynamically if called, and call the correct endpoint with synch method
            this.req.open(this.args.method, this.args.url, this.args.async);
            //Set the authorization type to bearer and pass the token
            if(typeof this.args.header !== 'undefined'){
                for(var i = 0; i < this.args.header.length; i++){
                    this.req.setRequestHeader(this.args.header[i][0], this.args.header[i][1]);
                }
            }
            //Set content type to json, which is what the server is expecting
            this.req.setRequestHeader('Content-Type', this.args.contentType);
            //this.req.setRequestHeader('Access-Control-Allow-Origin', '*');
        },
        _send: function(){
            //Convert the object to a json object that the server is expecting
            this.req.send(JSON.stringify(this.args.params));
            //Parse the returned value from the server
            if(this.req.responseText.length > 0)
                return JSON.parse(this.req.responseText);
            else
                return this.req.response;
        },
        constructor: Ajax
    };
    return Ajax;
});