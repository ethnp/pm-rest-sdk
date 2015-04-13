/**
 * Created by ethan on 4/13/15.
 */
define(function(require){
    'use strict';
    var ProcessMakerClass = require('ProcessMaker');
    var ProcessMaker = new ProcessMakerClass();
    var task = '939801528539f3eb66d0e50023948406';
    var process = '466881136539f3ea1038954012223783';
    var appuid = '9076584945528443ab935b9069716714';
    var lang = 'en';
    var skin = 'neoclassic';
    var workspace = 'workflow';
    var testValue = 'Jasmine Test Value';


    describe('ProcessMaker module testing suite', function(){
        it('ProcessMaker class Should be defined', function(){
            expect(ProcessMaker).toBeDefined();
        });
        it('Should have settings in config property loaded', function(){
            expect(Object.keys(ProcessMaker.config).length).toBeGreaterThan(0);
            expect(ProcessMaker.config).toEqual({
                "server" : "http://pm",
                "workspace" : "workflow",
                "clientId" : "NYNRYVNKKNYGUYNGURAAKCWCRLUQEPKS",
                "clientSecret" : "5519814215526ca9ebd4a93002540483",
                "redirectUri" : "http://localhost",
                "grantType" : "authorization_code",
                "scope" : "view_processes edit_processes"
            });
        });
        it('Should force new popup login window when running login function and return a valid access_token object', function(done){
            ProcessMaker.login().then(function(data){
                expect(Object.keys(data).length).toBeGreaterThan(0);
                expect(data.access_token.length).toBeGreaterThan(0);
                expect(data.refresh_token.length).toBeGreaterThan(0);
                expect(data.token_type).toEqual('bearer');
                expect(data.scope).toEqual('view_processes edit_processes');
                done();
            });
        });
        it('Should return a valid access_token object when requesting an access_token', function(done){
            ProcessMaker.getToken().then(function(data){
                expect(Object.keys(data).length).toBeGreaterThan(0);
                expect(data.access_token.length).toBeGreaterThan(0);
                expect(data.refresh_token.length).toBeGreaterThan(0);
                expect(data.token_type).toEqual('bearer');
                expect(data.scope).toEqual('view_processes edit_processes');
                done();
            });
        });
        it('Should return a list of cases from the inbox', function(){
            var inboxCases = ProcessMaker.GetInboxCases();
            expect(inboxCases).toBeDefined();
            expect(inboxCases.length >= 0).toBeTruthy();
        });
        it('Should return a list of cases from the draft', function(){
            var draftCases = ProcessMaker.GetDraftCases();
            expect(draftCases).toBeDefined();
            expect(draftCases.length >= 0).toBeTruthy();
        });
        it('Should return a list of cases from the participated', function(){
            var participatedCases = ProcessMaker.GetParticipatedCases();
            expect(participatedCases).toBeDefined();
            expect(participatedCases.length >= 0).toBeTruthy();
        });
        it('Should return a list of cases from the unassigned', function(){
            var unassignedCases = ProcessMaker.GetUnassignedCases();
            expect(unassignedCases).toBeDefined();
            expect(unassignedCases.length >= 0).toBeTruthy();
        });
        it('Should return a valid response for creating a new case', function(){
            var newCase = ProcessMaker.CreateNewCase(
                process,
                task
            );

            expect(newCase).toBeDefined();
            expect(newCase.app_uid).toBeDefined();
            expect(newCase.app_uid.length).toBeGreaterThan(0);

            expect(newCase.app_number).toBeDefined();
            expect(newCase.app_number).toBeGreaterThan(0);

        });
        it('Should return proper meta info for a case', function(){
            var metaInfo = ProcessMaker.GetCaseMetaInfo(appuid);
            expect(metaInfo).toBeDefined();
            expect(Object.keys(metaInfo).length).toBeGreaterThan(0);
            expect(metaInfo.app_create_date).toBeDefined();
            expect(metaInfo.app_number).toBeGreaterThan(0);
            expect(metaInfo.pro_name.length).toBeGreaterThan(0);
        });
        it('Should return a valid task object response', function(){
            var taskObject = ProcessMaker.GetTaskSteps(process, task);
            expect(taskObject).toBeDefined();
            expect(Object.keys(taskObject).length).toBeGreaterThan(0);
            expect(taskObject[0].step_uid_obj).toBeDefined();
            expect(taskObject[0].step_uid_obj.length).toBeGreaterThan(0);
        });
        it('Should return a proper dynaform definition object', function(){
            var taskObject = ProcessMaker.GetTaskSteps(process, task);
            var dynaformObject = ProcessMaker.GetDynaformDefinition(process, taskObject[0].step_uid_obj);
            expect(dynaformObject).toBeDefined();
            expect(Object.keys(dynaformObject).length).toBeGreaterThan(0);
            expect(dynaformObject.name.length).toBeGreaterThan(0);
            expect(dynaformObject.items[0]).toBeDefined();
            expect(dynaformObject.items[0].items).toBeDefined();
            expect(dynaformObject.items[0].items.length).toBeGreaterThan(0);
        });
        it('Should create a case and route it to the next task, as long as the routing rule is sequential', function(){
            var newCase = ProcessMaker.CreateNewCase(
                process,
                task
            );
            var routeCase = ProcessMaker.RouteCase(newCase.app_uid);
            expect(routeCase).not.toEqual(null);
            expect(routeCase).toBeDefined();
        });
        it('Should get case variables', function(){
            var variables = ProcessMaker.GetCaseVariables(appuid);
            expect(variables).toBeDefined();
            expect(Object.keys(variables).length).toBeGreaterThan(0);
            expect(variables.APPLICATION).toBeDefined();
            expect(variables.APPLICATION.length).toBeGreaterThan(0);
            expect(variables.SYS_LANG).toEqual(lang);
            expect(variables.SYS_SKIN).toEqual(skin);
            expect(variables.SYS_SYS).toEqual(workspace);
            expect(variables.USER_LOGGED.length).toEqual(32);
            expect(variables.USR_USERNAME.length).toBeGreaterThan(0);
        });
        it('Should update case variables', function(){
            var putVariables1 = ProcessMaker.UpdateCaseVariables(appuid, {
                test: ''
            });
            expect(putVariables1).not.toEqual(null);
            expect(putVariables1).toBeDefined();

            var getVariables1 = ProcessMaker.GetCaseVariables(appuid);
            expect(getVariables1).toBeDefined();
            expect(Object.keys(getVariables1).length).toBeGreaterThan(0);
            expect(getVariables1.test).toEqual('');

            var putVariables2 = ProcessMaker.UpdateCaseVariables(appuid, {
                test: testValue
            });
            expect(putVariables2).not.toEqual(null);
            expect(putVariables2).toBeDefined();

            var getVariables2 = ProcessMaker.GetCaseVariables(appuid);
            expect(getVariables2).toBeDefined();
            expect(Object.keys(getVariables2).length).toBeGreaterThan(0);
            expect(getVariables2.test).toEqual(testValue);

        });
        it('Should return a valid list of processes', function(){
            var processList = ProcessMaker.GetProcessesList();
            expect(processList).toBeDefined();
            expect(Object.keys(processList).length).toBeGreaterThan(0);
        });
        it('Should delete localStorage and effectively log out', function(){
            ProcessMaker.logout();
            var localToken = localStorage.getItem('pmtoken');
            expect(Object.keys(ProcessMaker.token).length).toEqual(0);
            expect(localToken).toEqual(null);
        });
    });
});