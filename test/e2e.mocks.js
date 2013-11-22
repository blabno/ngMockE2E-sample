parent.mocks = ['ngMockE2E'];
parent.mocks.api = {
    get_project_list: {},
    get_user_me: {},
    post_auth_token: {},
    post_user: {},
    post_user_activate: {}
};
parent.mocks.initializeMocks = function ($httpBackend)
{
    var POST = "POST";
    var GET = "GET";

    function setup(method, url, config)
    {
        $httpBackend.when(method, url).respond(function (requestMethod, requestUrl, notSureWhatItIs, headers)
        {
//            if (!config.expected) {
//                throw new Error("Unexpected call: " + requestMethod + " " + requestUrl);
//            }
            config.triggered = true;
            var response = config.response || {};
            if (config.serverLogic) {
                response = config.serverLogic(requestMethod, requestUrl, notSureWhatItIs, headers);
            }
            return [response.code || 200, response.data];
        });
    }

    setup(POST, "/api/user", mocks.api.post_user);
    setup(POST, /\/api\/user\/\d+\/activate\/.*/, mocks.api.post_user_activate);
    setup(POST, "/api/auth/token", mocks.api.post_auth_token);
    setup(GET, "/api/user/me", mocks.api.get_user_me);
    setup(GET, "/api/project/list", mocks.api.get_project_list);

    $httpBackend.whenGET(/.*\.html/).passThrough();
};

angular.scenario.dsl('mockApi', function ()
{
    return function (api)
    {
        return this.addFuture('value ' + api, function (done)
        {
            done(null, eval("mocks.api." + api))
        });
    };
});
angular.scenario.dsl('resetMocks', function ()
{
    return function ()
    {
        for (var key in parent.mocks.api) {
            if (parent.mocks.api.hasOwnProperty(key)) {
                var config = parent.mocks.api[key];
                config.triggered = false;
                config.serverLogic = undefined;
            }
        }
    }
});