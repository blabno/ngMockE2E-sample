#ngMockE2E sample

This project is an example of how you can mock httpBackend in an elastic way in your e2e tests.

You may inspect commits history to see what needs to be changed exactly in your application to be able to use ngMockE2E.

My custom add-on is mechanism for modifying server responses per each test.

##How it works
In general your app needs to have "ngMockE2E" module as it's dependency. You don't want that of course in your production.
You also need to run httpBackend initialization. The pain is that you may run it only once and during your application initializaiton.

So you need to have slightly different "_app.js" and index.html contents for production and for e2e tests. This is on big PITA.
To cope with that we take adventage of one loophole. E2E tests (if run using Karma which is our case) run inside iframe which is nested in frame consisting
javascripts from karma-e2e.conf.js.

So if we add our innocent, custom e2e.mock.js to our karma-e2e.conf.js we could use it to set some markers telling our "_app.js" it needs to behave a bit different.

##Mocking response per test
Once we've got our magician (e2e.mock.js) working we can use "mock.api" object to customize responses.
Let's look at some examples:

    describe("when activation token is invalid", function ()
    {
        it("should redirect user to error page", function ()
        {
            //            Given
            mockApi("post_user_activate").response ({code: 403});

            //            When
            var activationPath = "/activate/1/abc";
            browser().navigateTo(activationPath);

           //            Then
            expect(browser().location().path()).toEqual("/error");
            expect(element("#errorMessage").text()).toEqual("You don't have access to this page or resource!");
        });
    });

This test checks what happens if user enters "/activate/1/abc" URL. Under this URL there is a page with controller that invokes request to backend
checking if activation token is valid. Here is a call stack:

    UserActivateCtrl.init->UserDAO.activate->$resource("/api/user/1/activate/abc")

So we know that once user enters this URL there will be XHR request to "/api/user/1/activate/abc" triggered and we have to mock it.
Our e2e.mock.js has `initializeMocks` function that should be called during application initializaiton ("_app.js").
There is a setup of all calls that $httpBacked should mock. For this request it's this line:

    setup(POST, /\/api\/user\/\d+\/activate\/.*/, mocks.api.post_user_activate);

If you'd look at setup method:

    function setup(method, url, config)
    {
        $httpBackend.when(method, url).respond(function (requestMethod, requestUrl, notSureWhatItIs, headers)
        {
            config.triggered = true;
            var response = config.response || {};
            if (config.serverLogic) {
                response = config.serverLogic(requestMethod, requestUrl, notSureWhatItIs, headers);
            }
            return [response.code || 200, response.data];
        });
    }

You will see that the response will be either value of mocks.api.post_user_activate.response or whatever is returned by mocks.api.post_user_activate.serverLogic
 function.

So in case of our test (invalid token) we simply return 403 HTTP code. That's it.

##Mocking returned data
Often we need to mock data returned from $httpBackend. Look at this:

    describe("when activation token is valid", function ()
    {
        var activationPath = "/activate/2/defg1234";
        beforeEach(function ()
        {
//            Given
            mockApi("post_user_activate").response({code: 200, data: "access token"});
            mockApi("get_user_me").response({code: 200, data: {email: "bernard@itcrowd.pl"}});

//            When
            browser().navigateTo(activationPath);
        });

        it("should show activation complete panel", function ()
        {
//            Then
            expect(browser().location().path()).toEqual(activationPath);
            expect(element(".view-user-activate:visible").count()).toEqual(1);
        });

The request that activates the account should return access token so that user doesn not need to log in.

    mockApi("post_user_activate").response({code: 200, data: "access token"});

This is achieved by above line. Besides `code` we simply add `data` attribute to the response.

##Mocking server logic
Sometimes the only way to test some application logic is to return different respone from the backend depending on request data.
Take a look at logout.test.js

    describe("Sign out", function ()
    {
        beforeEach(function ()
        {
    //        Given
            mockApi("post_auth_token").response({data: "access token"});
            mockApi("get_project_list").serverLogic(function (requestMethod, requestUrl, notSureWhatItIs, headers)
            {
                if ("Token YWNjZXNzIHRva2Vu" == headers.Authorization) {
                    return {code: 200, data: []};
                } else if (undefined != headers.Authorization) {
                    return {code: 403};
                } else {
                    return {code: 401};
                }
            });

    //        When
            browser().navigateTo("/signin");
            input("credentials.email").enter("bernard@itcrowd.pl");
            input("credentials.password").enter("aaaaa");
            element("#login-form .btn-primary").click();
            browser().navigateTo("/projects");
            element("#logout").click();
        });

        it("should NOT be possible for user to enter project list", function ()
        {
    //        When
            browser().navigateTo("/projects");

    //        Then
            expect(element("#login-form:visible").count()).toEqual(1);
        });
    });

First we sign in our user. Backend should return access token that we should inclue (Base64 encoded) in subsequent request in Authorization header
as authentication credentials. Then we enter projects list page (for authenticated users only) and click logout button.
Now our application should clear (forget) the access token. Finally we attempt to enter projects list page once again but the server should return 401
beacause app should not include access token. In such situations the login form should be displayed.
