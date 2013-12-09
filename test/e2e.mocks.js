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
    var api = parent.mocks.api;
    return function (itemName)
    {
        var chain = {};
        chain.reset = function ()
        {
            function reset(config)
            {
                delete config.response;
                delete config.serverLogic;
                config.triggered = false;
            }

            if (parent.mocks.api.hasOwnProperty(itemName)) {
                return this.addFuture('reset mock ' + itemName, function (done)
                {
                    reset(api[itemName]);
                    done(null);
                });
            } else {
                return this.addFuture('reset all mocks', function (done)
                {
                    for (var key in api) {
                        if (api.hasOwnProperty(key)) {
                            reset(api[key]);
                        }
                    }
                    done(null);
                });
            }
        };
        chain.response = function (value)
        {
            if (undefined == value) {
                if (!api.hasOwnProperty(itemName)) {
                    throw new Error("Unknown API item: " + name);
                } else {
                    return this.addFuture("get response for " + itemName, function (done)
                    {
                        done(null, api[itemName].response);
                    });
                }
            }
            var stringifiedValue;
            try {
                stringifiedValue = JSON.stringify(value);
            } catch (e) {
                stringifiedValue = "" + value;
            }
            return this.addFuture("set response for " + itemName + ":" + stringifiedValue, function (done)
            {
                api[itemName].response = value;
                done(null);
            });
        };
        chain.serverLogic = function (value)
        {
            if (!api.hasOwnProperty(itemName)) {
                throw new Error("Unknown API item: " + name);
            }
            return this.addFuture("set server logic for " + itemName, function (done)
            {
                api[itemName].serverLogic = value;
                done(null);
            });
        };
        chain.triggered = function (value)
        {
            if (undefined == value) {
                if (!api.hasOwnProperty(itemName)) {
                    throw new Error("Unknown API item: " + itemName);
                } else {
                    return this.addFuture("get triggered flag for " + itemName, function (done)
                    {
                        done(null, api[itemName].triggered || false);
                    });
                }
            }
            return this.addFuture("set triggered flag for " + itemName, function (done)
            {
                api[itemName].triggered = value;
                done(null);
            });
        };
        return chain;
    };
});
