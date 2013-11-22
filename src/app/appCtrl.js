ngMockE2Esample.controller("AppCtrl", function ($scope, $location, $rootScope, $route, Authenticator, UserDAO)
{
    var fetchCurrentUserInProgress = false, currentUser;

    $scope.showSignup = function ()
    {
        $location.url("/signup");
    };

    $scope.showSignin = function ()
    {
        $location.url("/signin");
    };

    $scope.logout = function ()
    {
        Authenticator.logout();
        currentUser = undefined;
        $scope.showSignin();
    };

    /**
     * ApplicationEventBus has access only to $rootScope
     */
    $rootScope.getCurrentUser = function ()
    {
        return currentUser;
    };

    $scope.fetchCurrentUser = function (success)
    {
        if (currentUser === undefined && !fetchCurrentUserInProgress) {
            console.debug("Fetching current user...");
            fetchCurrentUserInProgress = true;
            UserDAO.getMe(function (user)
            {
                currentUser = user;
                fetchCurrentUserInProgress = false;
                if (success instanceof Function) {
                    success(user);
                }
            });
        } else {
            if (success instanceof Function) {
                success(currentUser);
            }
        }
    };

    $scope.$on("ngMockE2Esample:authentication-token-set", function ()
    {
        currentUser = undefined;
        $scope.fetchCurrentUser(null);
    });

});

ngMockE2Esample.controller("SignupCtrl", function ($scope)
{
    $scope.$root.$broadcast("event:signupRequired");
    $scope.$on("$destroy", function ()
    {
        $scope.$root.$broadcast("event:hide-signup");
    });
});

ngMockE2Esample.controller("SigninCtrl", function ($scope)
{
    $scope.$root.$broadcast("event:auth-loginRequired");
    $scope.$on("$destroy", function ()
    {
        $scope.$root.$broadcast("event:hide-signup");
    });
});

ngMockE2Esample.controller("LoginCtrl", function ($scope, $location, $route, authService, Authenticator, MessageFactory, UserDAO)
{
    var MODE_SIGNUP = "signup";
    var MODE_SIGNIN = "signin";
    var MODE_SIGNUP_COMPLETE = "signup-complete";
    var mode = MODE_SIGNIN;
    $scope.credentials = {email: null, password: null};
    $scope.passwordConfirmation = "";

    /**
     * Only for UI display, please use server-side check for important actions.
     */

    $scope.login = function ()
    {
        Authenticator.login($scope.credentials.email, $scope.credentials.password, function ()
        {
            authService.loginConfirmed(null);
            $scope.fetchCurrentUser(null);
            $scope.credentials = {};
            if ("/signin" == $location.url() || "/signup" == $location.url()) {
                $location.url("/projects");
            }
        });
    };

    $scope.register = function ()
    {
        if ($scope.credentials.password != $scope.passwordConfirmation) {
            throw new Error("Passwords do not match!");
        }
        UserDAO.register($scope.credentials.email, $scope.credentials.password, function ()
        {
            mode = MODE_SIGNUP_COMPLETE;
        }, function (data)
        {
            if ("string" === typeof data) {
                MessageFactory.error(data);
            } else {
                MessageFactory.error("Registration failed");
                var violations = data['constraintViolations'];
                if (undefined != violations) {
                    for (var i = 0; i < data['constraintViolations'].length; i++) {
                        MessageFactory.error(violations[i]['propertyPath'] + ":" + violations[i]['message']);
                    }
                }
            }
        });
    };

    $scope.showSignupForm = function ()
    {
        mode = MODE_SIGNUP;
    };

    $scope.showSigninForm = function ()
    {
        mode = MODE_SIGNIN;
    };

    $scope.isSigninMode = function ()
    {
        return MODE_SIGNIN === mode;
    };

    $scope.isSignupMode = function ()
    {
        return MODE_SIGNUP === mode;
    };

    $scope.isSignupCompleteMode = function ()
    {
        return MODE_SIGNUP_COMPLETE === mode;
    };

    $scope.$on("event:auth-loginRequired", $scope.showSigninForm);
    $scope.$on("event:signupRequired", $scope.showSignupForm);

});
