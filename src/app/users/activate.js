users.controller('UserActivateCtrl', function ($scope, $location, $routeParams, Authenticator, UserDAO)
{
    var viewReady;

    if (undefined == $routeParams.token || "" == $routeParams.token.trim()) {
        $scope.$root.errorMessage = "Invalid activation token";
        $location.path("/error");
        return;
    }

    UserDAO.activate($routeParams.userId, $routeParams.token, null, function (accessToken)
    {
        Authenticator.setToken(accessToken);
        viewReady = true;
    });

    $scope.isViewReady = function ()
    {
        return viewReady;
    };

});
