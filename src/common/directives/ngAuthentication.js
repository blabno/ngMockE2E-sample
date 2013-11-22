/**
 * This directive will find itself inside HTML as a class,
 * and will remove that class, so CSS will remove loading image and show app content.
 * It is also responsible for showing/hiding login form.
 */
angular.module('directives.ngAuthentication', []).directive('ngAuthentication', function ($timeout)
{
    return {
        restrict: 'C',
        link: function (scope, elem)
        {
            //once Angular is started, remove class:
            elem.removeClass('waiting-for-angular');

            var login = elem.find('#login-holder');

            /**
             * Since Angular 1.2-rc3 ng-view element is not in DOM at the time of executing this linking function
             */
            function getMain()
            {
                return elem.find('#content');
            }

            login.hide();

            scope.$on('event:auth-loginRequired', function ()
            {
                getMain().hide();
                login.show();
                login.find("#inputUsername").focus();
            });

            scope.$on('event:signupRequired', function ()
            {
                getMain().hide();
                login.show();
                $timeout(function ()
                {
                    login.find("#inputEmail2").focus();
                })
            });

            var hide = function ()
            {
                getMain().show();
                login.slideUp();
            };
            scope.$on('event:auth-loginConfirmed', hide);
            scope.$on('event:hide-signup', hide);
        }
    }
});