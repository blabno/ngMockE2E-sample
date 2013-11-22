angular.module('services.ExceptionHandler', []).config(function ($httpProvider)
{
    var interceptor = ['$rootScope', '$location', '$q', function ($scope, $location, $q)
    {

        function success(response)
        {
            return response;
        }

        function error(response)
        {
            var status = response.status;
            if (undefined != response.config && undefined != response.config.skipDefaultInterceptors && undefined
                    != response.config.skipDefaultInterceptors.codes && response.config.skipDefaultInterceptors.codes.indexOf(status) > -1) {
                return $q.reject(response);
            }
            switch (status) {
                case 400:
                    $scope.errorMessage = "Request cannot be fulfilled due to bad syntax!";
                    break;
                case 401:
                    return response; // Let http-auth-interceptor.js handle this response
                case 403:
                    $scope.errorMessage = "You don't have access to this page or resource!";
                    break;
                case 404:
                    $scope.errorMessage = "The page or resource your are looking for does not exist!";
                    break;
                case 405:
                    $scope.errorMessage = "Request method not supported!";
                    break;
                case 408:
                    $scope.errorMessage = "The server timed out waiting for the request!";
                    break;
                case 412:
                    $scope.errorMessage = "Precondition failed: " + response.data;
                    break;
                case 415:
                    $scope.errorMessage = "This media type is not supported!";
                    break;
                case 503:
                    $scope.errorMessage = "The server is currently unavailable (overloaded or down)!";
                    break;
                case 505:
                    $scope.errorMessage = "The server does not support the HTTP protocol version used in the request!";
                    break;
                default:
                    $scope.errorMessage = response.message ? response.message : "Internal Server Error! Something went really wrong...";

            }
            $location.path("/error");
            return $q.reject(response);
        }

        return function (promise)
        {
            return promise.then(success, error);
        }
    }];
    $httpProvider.responseInterceptors.push(interceptor);
});

