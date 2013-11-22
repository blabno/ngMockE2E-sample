/**
 * Directive has the following options:
 * - It can show all messages or only those of specific type. To display all messages use ng-messages attribute with no parameters.
 *   To display messages of certain type use ng-messages="[type]" ex. ng-messages="error". Note that you can have several ng-messages tags on page,
 *   each displaying different type of messages.
 * - Message bubbles can stay until they are closed by the user (default option) or fade out after given time. For the latter use attribute
 *   stay-time="[time in millis]" .
 */
angular.module('directives.ngMessages', []).directive('ngMessages', function (MessageFactory, $timeout, $compile)
{
    return {
        scope: true,
        template: '<div id="messages" ng-repeat="message in messages"></div>',
        link: function ($scope, element, attr)
        {
            function show(message, type)
            {
                var messageTemplate = '<div class="alert"><button type="button" class="close" data-dismiss="alert">&times;</button>' + message + '</div>';
                var messageElement = $compile(messageTemplate)($scope);
                messageElement.addClass('alert-' + type);
                element.append(messageElement);
                if (attr.stayTime) {
                    $timeout(function ()
                    {
                        messageElement.fadeOut(400, function ()
                        {
                            messageElement.remove();
                        });
                    }, attr.stayTime);
                }
            }

            $scope.$on('$destroy', function ()
            {
                MessageFactory.clean();
            });

            MessageFactory.subscribe(show, attr.ngMessages);
        }
    };
});