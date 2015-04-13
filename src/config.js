/**
 * Created by ethan on 4/7/15.
 */
define('Config', ['Ajax'], function(Ajax){
    var Ajax = new Ajax();
    function Config(){
        this.settings = this._getConfig();
        if('/' === this.settings.server.substr(-1)) this.settings.server = this.settings.server.substr(0, this.settings.server.length-1);
        return this;
    }
    Config.prototype = {
        settings: {},
        constructor: Config,
        _getConfig: function () {
            return Ajax.makeCall({url: 'example.app.json', isLocal: true});

        }
    };
    return Config;
});