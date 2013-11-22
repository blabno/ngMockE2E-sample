describe("Activate account", function ()
{
    beforeEach(function ()
    {
        resetMocks();
    });

    describe("when activation token is invalid", function ()
    {
        it("should redirect user to error page", function ()
        {
//            Given
            mocks.api.post_user_activate.response = {code: 403};

//            When
            var activationPath = "/activate/1/abc";
            browser().navigateTo(activationPath);

//            Then
            expect(browser().location().path()).toEqual("/error");
            expect(element("#errorMessage").text()).toEqual("You don't have access to this page or resource!");
        });
    });

    describe("when activation token is valid", function ()
    {
        var activationPath = "/activate/2/defg1234";
        beforeEach(function ()
        {
//            Given
            mocks.api.post_user_activate.response = {code: 200, data: "access token"};
            mocks.api.get_user_me.response = {code: 200, data: {email: "bernard@itcrowd.pl"}};

//            When
            browser().navigateTo(activationPath);
        });

        it("should show activation complete panel", function ()
        {
//            Then
            expect(browser().location().path()).toEqual(activationPath);
            expect(element(".view-user-activate:visible").count()).toEqual(1);
        });

        it("should be able to go to project list (access token set)", function ()
        {
//            Given
            mocks.api.get_project_list.serverLogic = function (requestMethod, requestUrl, notSureWhatItIs, headers)
            {
                if ("Token YWNjZXNzIHRva2Vu" == headers.Authorization) {
                    return {code: 200, data: []};
                } else {
                    return {code: 403};
                }
            };

//            Then
            element("a[href='/projects']").click();
            expect(browser().location().path()).toEqual("/projects");
        });
    });

});