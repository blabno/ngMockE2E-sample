describe("Sign out", function ()
{
    beforeEach(function ()
    {
//        Given
        mocks.api.post_auth_token.response = {data: "access token"};
        mocks.api.get_project_list.serverLogic = function (requestMethod, requestUrl, notSureWhatItIs, headers)
        {
            if ("Token YWNjZXNzIHRva2Vu" == headers.Authorization) {
                return {code: 200, data: []};
            } else if (undefined != headers.Authorization) {
                return {code: 403};
            } else {
                return {code: 401};
            }
        };

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

    it("should redirect to Sign in screen", function ()
    {
//        Then
        expect(browser().location().path()).toEqual("/signin");
    });
});
