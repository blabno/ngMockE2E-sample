projects.controller('ProjectListCtrl', function ($scope, $location, MessageFactory, ProjectDAO)
{
    var viewReady;

    $scope.isViewReady = function ()
    {
        return viewReady;
    };

    ProjectDAO.list(function (projects)
    {
        $scope.projects = projects;
        viewReady = true;
    });

    $scope.showWorkspace = function (projectId)
    {
        $location.path('/workspace/' + projectId);
    };

    $scope.edit = function (projectId)
    {
        $location.path('/projects/edit/' + projectId);
    };

    $scope.create = function ()
    {
        $location.path('/projects/create');
    };
});
