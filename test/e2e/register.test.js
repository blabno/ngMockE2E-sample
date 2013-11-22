describe("Register account", function ()
{
    beforeEach(function ()
    {
        mockApi().reset();
    });

    describe("when passwords do not match", function ()
    {
        beforeEach(function ()
        {
//            Given
//            When
            browser().navigateTo("/signup");
            input("credentials.email").enter("bernard@labno.pl");
            input("credentials.password").enter("aaaaa");
            input("passwordConfirmation").enter("bbbbb");
            element("#register-form .btn-primary").click();
        });

        it("should NOT trigger request to server", function ()
        {
//            Then
            expect(mockApi("post_user").triggered()).toBe(false);
        });

        it("should display error message", function ()
        {
//            Then
            expect(element(".alert").text()).toEqual("×Passwords do not match!");
        });
    });

    describe("happy path", function ()
    {
        beforeEach(function ()
        {
//            Given
//            When
            browser().navigateTo("/signup");
            input("credentials.email").enter("bernard@labno.pl");
            input("credentials.password").enter("aaaaa");
            input("passwordConfirmation").enter("aaaaa");
            element("#register-form .btn-primary").click();
        });

        it("should trigger request to server", function ()
        {
//            Then
            expect(mockApi("post_user").triggered()).toBe(true);
        });

        it("should show 'Welcome aboard!' message in place of registration form", function ()
        {
//            Then
            expect(element(".registration-complete:visible").count()).toEqual(1);
        });
    });

});