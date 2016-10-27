(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.IframeAPI = factory();
    }
}(this, function () {
    function IframeAPI(options) {
        this.changeSource(options.frame, options.url);
        this.publicMethods = options.methods;
        this.handleMessage = this.handleMessage.bind(this);
        if (this.frame && this.targetOrigin) {
            this.listen();
        }
    }

    IframeAPI.prototype.changeSource = function (node, url) {
        if (node) {
            this.frame = node;
        }
        if (url) {
            this.targetOrigin = url.replace(/^(\w+\:\/\/[^\/]+).*/, '$1');
        }
    };

    IframeAPI.prototype.listen = function () {
        window.addEventListener('message', this.handleMessage);
    };

    IframeAPI.prototype.unlisten = function () {
        window.addEventListener('message', this.handleMessage);
    };

    IframeAPI.prototype.send = function (data) {
        if (!this.frame) {
            console.log('Frame is invalid', this.frame);
            return;
        }
        if ('postMessage' in this.frame) {
            this.frame.postMessage(JSON.stringify(data), this.targetOrigin);
        } else if ('contentWindow' in this.frame) {
            this.frame.contentWindow.postMessage(JSON.stringify(data), this.targetOrigin);
        }
    };

    IframeAPI.prototype.handleMessage = function (event) {
        var origin = event.origin || event.origin; // For Chrome, the origin property is in the event object.
        if (origin !== this.targetOrigin) {
            console.log('Recieved message with wrong origin. Current target: ' + this.targetOrigin + '; Event target: ' + origin);
            return;
        }
        var message;
        try {
            message = JSON.parse(event.data)
        } catch (e) {
            console.log('Failed to parse received message: ' + event.data);
        }
        if (message && ('method' in message) && (message.method in this.publicMethods)) {
            this.publicMethods[message.method].call(this, message.data);
        }
    };

    return IframeAPI;
}));