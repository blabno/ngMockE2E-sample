var appDependencies = ['ngResource', 'ngCookies', 'ngRoute', 'models.MessageFactory', 'http-auth-interceptor', 'services.Authenticator',
    'services.ExceptionHandler', 'services.UserDAO', 'services.MD5', 'directives.ngAuthentication', 'directives.ngMessages', 'projects', 'users'];
/**
 * Start of block required for e2e tests
 */
var mocks = parent.parent ? parent.parent.mocks : parent.mocks;
mocks = mocks || [];
var dependencies = (mocks ? mocks : []).concat(appDependencies);
/**
 * End of block required for e2e tests
 */
var ngMockE2Esample = angular.module("ngMockE2Esample", dependencies);
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

/**
 * Start of block required for e2e tests
 */
if (undefined != mocks.initializeMocks) {
    ngMockE2Esample.run(mocks.initializeMocks);
}
/**
 * End of block required for e2e tests
 */
