var projects = angular.module('projects', ['services.ProjectDAO']);

projects.config(['$routeProvider', function ($routeProvider)
{
    $routeProvider.when('/projects', {controller: 'ProjectListCtrl', templateUrl: 'app/projects/projectList.html'});
}]);


