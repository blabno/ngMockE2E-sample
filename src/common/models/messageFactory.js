angular.module('models.MessageFactory', []).factory("MessageFactory", function ()
{
    var subscribers = [];
    return {
        notify: function (type, message)
        {
            angular.forEach(subscribers, function (subscriber)
            {
                if (!subscriber.type || subscriber.type === type) {
                    subscriber.cb(message, type);
                }
            });
        },
        clean: function ()
        {
            subscribers = [];
        },
        subscribe: function (subscriber, type)
        {
            subscribers.push({
                cb: subscriber,
                type: type
            });
        },
        success: function (message)
        {
            this.notify('success', message);
        },
        info: function (message)
        {
            this.notify('info', message);
        },
        warn: function (message)
        {
            this.notify('warn', message);
        },
        error: function (message)
        {
            this.notify('error', message);
        }
    };
});
