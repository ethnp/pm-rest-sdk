/**
 * Created by ethan on 4/6/15.
 */
requirejs.config({
    baseUrl : '../src',
    paths : {
        tests : '../tests'
    }
});

requirejs(['ProcessMaker'], function(ProcessMaker){
    var ProcessMaker = new ProcessMaker();

    /* For logging out of ProcessMaker - this actually just destroys the
    token locally, it doesn't actually log you out of the api */
    //ProcessMaker.logout();

    /*
    Get the access token, if you are not logged into the api, it will attempt to
    log you in automatically via authorization code type
     */
    ProcessMaker.getToken().then(function(data){
        /*
        This function is the promise function. The response will be passed here after the promise is resolved. The data variable will hold the access token object
         */
        /*
        Here is a list of all the available rest api endpoints in this sdk:

         GetInboxCases
         GetDraftCases
         GetParticipatedCases
         GetUnassignedCases
         CreateNewCase
         GetCaseMetaInfo
         GetTaskSteps
         GetDynaformObject
         GetDynaformDefinition
         RouteCase
         GetCaseVariables
         UpdateCaseVariables
         GetProcessesList

         They can be used like so: ProcessMaker.GetInboxCases() or ProcessMaker.CreateNewCase(prouid, taskuid)
         */
    });
});