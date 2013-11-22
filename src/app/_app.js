var appDependencies = ['ngResource', 'ngCookies', 'ngRoute', 'models.MessageFactory', 'http-auth-interceptor', 'services.Authenticator',
    'services.ExceptionHandler', 'services.UserDAO', 'services.MD5', 'directives.ngAuthentication', 'directives.ngMessages', 'projects', 'users'];
var ngMockE2Esample = angular.module("ngMockE2Esample", appDependencies);
ngMockE2Esample.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider)
{
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');
    $routeProvider.when('/signup', {controller: 'SignupCtrl', templateUrl: "app/home.html"}).when('/signin',
            {controller: 'SigninCtrl', templateUrl: "app/home.html"}).when('/error', {templateUrl: 'app/error.html'}).otherwise({redirectTo: '/projects'});

}]);

ngMockE2Esample.config(function ($provide)
{
    $provide.decorator("$exceptionHandler", function ($delegate, MessageFactory)
    {
        return function (exception, cause)
        {
            $delegate(exception, cause);
            MessageFactory.error(exception.message);
        };
    });
});
