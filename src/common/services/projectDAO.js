angular.module('services.ProjectDAO', []).factory("ProjectDAO", function ($resource)
{
    var ProjectREST = $resource("/api/project/:id/:controller/:changeRequestId/:message", {id: "@id"}, {
        'query': {method: 'GET', isArray: true, params: {controller: "list"}},
        'changes': {method: 'GET', isArray: true, params: {controller: "changes"}},
        'changelists': {method: 'GET', isArray: true, params: {controller: "changelists"}},
        'changerequests': {method: 'GET', isArray: true, params: {controller: "changerequests"}},
        'member': {method: 'PUT', params: {controller: "member", changeRequestId: "@email", message: "@role"}},
        'removeMember': {method: 'DELETE', params: {controller: "member", changeRequestId: "@email"}},
        'commit': {method: 'POST', params: {controller: "commit", message: "@message", changeRequestId: "@changeRequestId"}},
        'setdefaultchangelistactive': {method: 'POST', params: {controller: "set-default-changelist-active"}},
        'rootpackages': {method: 'GET', isArray: true, params: {controller: "rootpackages"}},
        'issues': {method: 'GET', params: {controller: "issues"}}
    });
    return {
//        addMember: function (projectId, email, success, failure)
//        {
//            ProjectREST.member({id: projectId}, {email: email}, success, failure);
//        },
//        removeMember: function (projectId, email, success, failure)
//        {
//            ProjectREST.removeMember({id: projectId}, {email: email}, success, failure);
//        },
//        setRole: function (projectId, email, role, success, failure)
//        {
//            ProjectREST.member({id: projectId}, {email: email, role: role}, success, failure);
//        },
//        persistProject: function (project, callback)
//        {
//            var restProject = new ProjectREST(project);
//            restProject.$save(function (result)
//            {
//                angular.extend(project, result);
//                if (callback instanceof Function) {
//                    callback(project);
//                }
//            });
//        },
//        removeProject: function (projectId, callback)
//        {
//            var restProject = new ProjectREST({id: projectId});
//            restProject.$delete(function ()
//            {
//                if (callback instanceof Function) {
//                    callback(projectId);
//                }
//            });
//        },
        list: function (success, error)
        {
            ProjectREST.query({}, success, error);
        }
//        ,
//        commit: function (projectId, changeRequestId, message, success, error)
//        {
//            ProjectREST.commit({id: projectId, changeRequestId: changeRequestId, message: message}, success, error);
//        },
//        setDefaultChangelistActive: function (projectId, success, error)
//        {
//            ProjectREST.setdefaultchangelistactive({id: projectId}, success, error);
//        },
//        getChanges: function (projectId, success, error)
//        {
//            ProjectREST.changes({id: projectId}, success, error);
//        },
//        getChangeLists: function (projectId, success, error)
//        {
//            ProjectREST.changelists({id: projectId}, success, error);
//        },
//        getChangeRequests: function (projectId, success, error)
//        {
//            ProjectREST.changerequests({id: projectId}, success, error);
//        },
//        getProject: function (projectId, success, error)
//        {
//            ProjectREST.get({id: projectId}, success, error);
//        },
//        getRootPackages: function (projectId, success, error)
//        {
//            ProjectREST.rootpackages({id: projectId}, success, error);
//        },
//        getIssues: function (projectId, filter, success, error)
//        {
//            var params = angular.extend({}, filter, {id: projectId});
//            ProjectREST.issues(params, success, error);
//        }
    }
});
