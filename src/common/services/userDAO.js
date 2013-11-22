angular.module('services.UserDAO', []).factory("UserDAO", function ($resource, $http)
{
    var CRUDREST = $resource("/api/user/:id", {id: "@id"}, {
        'me': {method: 'GET', params: {id: 'me'}}
    });
    return {
        activate: function (id, token, password, success, failure)
        {
            var request = $http.post("/api/user/" + id + "/activate/" + token, password);
            if (success instanceof Function) {
                request.success(success);
            }
            if (failure instanceof Function) {
                request.error(failure);
            }
        },
        getMe: function (success, failure)
        {
            CRUDREST.me({}, success, failure);
        },
//        changePassword: function (currentPassword, newPassword, success, failure)
//        {
//            var post = $http.post("/api/user/me/password", "current=" + currentPassword + "&new=" + newPassword,
//                    {headers: {'Content-Type': 'application/x-www-form-urlencoded'}});
//            if (success instanceof Function) {
//                post.success(success)
//            }
//            if (failure instanceof Function) {
//                post.error(failure);
//            }
//        },
        register: function (email, password, success, failure)
        {
            delete $http.defaults.headers.common.Authorization;
            var post = $http.post("/api/user", "email=" + email + "&password=" + password, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}});
            if (success instanceof Function) {
                post.success(success)
            }
            if (failure instanceof Function) {
                post.error(failure);
            }
        }
    }
});
