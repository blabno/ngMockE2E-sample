var users = angular.module('users', ['services.UserDAO']);

users.config(['$routeProvider', function ($routeProvider)
{
    $routeProvider.when('/activate/:userId/:token', {controller: 'UserActivateCtrl', templateUrl: 'app/users/activate.html'});

}]);
