/**
 * Created by ethan on 4/6/15.
 */
define('ProcessMaker', ['Ajax', 'Config'], function(Ajax, Config){
    var Ajax = new Ajax();
    var Config = new Config();

    function ProcessMaker(){
        this.config = Config.settings;
        return this;
    }

    ProcessMaker.prototype = {
        config: {},
        token: {},
        getToken: function(){
            this.token = JSON.parse(localStorage.getItem('pmtoken'));
            if(typeof this.token !== 'undefined' && this.token !== null){
                if(typeof this.token.expires_in !== 'undefined' && typeof this.token.error === 'undefined'){
                    var nowDate = new Date();
                    var tokenDate = new Date(this.token.expires_in);
                    if(nowDate > tokenDate){
                        return Promise.resolve(this.login('refresh_token'));
                    }else{
                        return Promise.resolve(this.token);
                    }
                }else{
                    return this.login();
                }
            }else{
                return this.login();
            }
        },
        login: function(type){
            if(typeof type === 'undefined') type = 'authorization_code';
            switch(type){
                case 'authorization_code':
                    return this._loginWithAuthorizationCode();
                break;
                case 'refresh_token':
                    return this._loginWithRefreshToken();
                break;
                default:
                break;
            }
        },
        logout: function(){
            delete this.token;
            localStorage.removeItem('pmtoken');
        },
        _loginWithRefreshToken: function(){
            return this._getAccessToken('refresh_token', this.token.refresh_token);
        },
        _loginWithAuthorizationCode: function(){
            var popupWidth = 500, popupHeight = 500;
            var oauthUrl = this.config.server + '/api/1.0/' + this.config.workspace + '/oauth2/authorize?response_type=code&client_id=' + this.config.clientId + '&redirect_uri=' + this.config.redirectUri + '&scope=' + this.config.scope;

            // Open the popup
            var left =
                window.screenX + (window.outerWidth / 2) - (popupWidth / 2);
            var top =
                window.screenY + (window.outerHeight / 2) - (popupHeight / 2);
            var windowFeatures = 'width=' + popupWidth +
                ',height=' + popupHeight +
                ',top=' + top +
                ',left=' + left +
                ',location=yes,toolbar=no,menubar=no';

            var win = window.open(oauthUrl, 'ProcessMakerOAuthLoginWindow', windowFeatures);
            var self = this;
            var code = '';
            var promise = new Promise( function (resolve, reject){
                var poll = window.setInterval(function(){
                    try {
                        if (win.document.URL.indexOf(self.config.redirectUri) != -1) {
                            var strOauthCode = win.document.URL.substr(win.document.URL.indexOf('?') + 1);
                            var arrOauthCode = strOauthCode.split('=');
                            resolve(self._getAccessToken('authorization_code', arrOauthCode[1]));
                            win.close();
                            window.clearInterval(poll);
                        }
                    } catch(e){
                        //console.log(e);
                    }
                }, 10, self);
            });
            return promise;
        },
        _getAccessToken: function(type, code_or_token){
            switch(type){
                case 'authorization_code':
                    var response = Ajax.makeCall({
                        url: this.config.server + '/api/1.0/' + this.config.workspace + '/token',
                        params: {
                            grant_type: 'authorization_code',
                            code: code_or_token,
                            client_id: this.config.clientId,
                            client_secret: this.config.clientSecret,
                            redirect_uri: this.config.redirectUri
                        },
                        method: 'POST'
                    });
                    break;
                case 'refresh_token':
                    var response = Ajax.makeCall({
                        url: this.config.server + '/api/1.0/' + this.config.workspace + '/token',
                        params: {
                            grant_type: 'refresh_token',
                            refresh_token: code_or_token,
                            client_id: this.config.clientId,
                            client_secret: this.config.clientSecret,
                            redirect_uri: this.config.redirectUri
                        },
                        method: 'POST'
                    });
                    break;
                default:
                    break;
            }

            this.token = response;
            var d = new Date();
            d.setTime(d.getTime() + 60*60*1000);
            this.token.expires_in = d;
            localStorage.setItem('pmtoken', JSON.stringify(this.token));
            return this.token;
        },
        endpoint: function(endpoint, method, access_token, params){
            var response = Ajax.makeCall({
                url: this.config.server + '/api/1.0/' + this.config.workspace + '/' + endpoint,
                params: params,
                method: method.toUpperCase(),
                header: [['Authorization', 'Bearer ' + access_token]]
            });
            return response;
        },
        GetInboxCases: function(){
            return this.endpoint('cases', 'GET', this.token.access_token);
        },
        GetDraftCases: function(){
            return this.endpoint('cases/draft', 'GET', this.token.access_token);
        },
        GetParticipatedCases: function(){
            return this.endpoint('cases/participated', 'GET', this.token.access_token);
        },
        GetUnassignedCases: function(){
            return this.endpoint('cases/unassigned', 'GET', this.token.access_token);
        },
        CreateNewCase: function(prouid, tasuid){
            return this.endpoint('cases', 'POST', this.token.access_token, {'pro_uid': prouid, 'tas_uid': tasuid});
        },
        GetCaseMetaInfo: function(appuid){
            return this.endpoint('cases/' + appuid, 'GET', this.token.access_token);
        },
        GetTaskSteps: function(prouid, tasuid){
            return this.endpoint('project/' + prouid + '/activity/' + tasuid + '/steps', 'GET', this.token.access_token);
        },
        GetDynaformObject: function(prouid, dynuid){
            return this.endpoint('project/' + prouid + '/dynaform/' + dynuid, 'GET', this.token.access_token);
        },
        GetDynaformDefinition: function(prouid, dynuid){
            var dynaform = this.GetDynaformObject(prouid, dynuid);
            return JSON.parse(dynaform.dyn_content);
        },
        RouteCase: function(appuid){
            return this.endpoint('cases/' + appuid + '/route-case', 'PUT', this.token.access_token);
        },
        GetCaseVariables: function(appuid){
            return this.endpoint('cases/' + appuid + '/variables', 'GET', this.token.access_token);
        },
        UpdateCaseVariables: function(appuid, data){
            return this.endpoint('cases/' + appuid + '/variable', 'PUT', this.token.access_token, data);
        },
        GetProcessesList: function(){
            return this.endpoint('projects', 'GET', this.token.access_token);
        },

        constructor: ProcessMaker
   };


    return ProcessMaker;
});