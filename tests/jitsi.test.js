/* globals YAHOO */

Jitsi.Test = {};

Jitsi.Test.MockApplet = Jitsi.Applet.extend(
{
  init: Jitsi.Function.around(
    function($super) {
      this._handlers = {};
      if (Jitsi.isFunction($super)) {
        $super.apply(this, Array.from(arguments).slice(-1));
      }
    }
  ),

  receiveEvent: function(rawEvent) {
  },

  sendEvent: function(rawEvent) {
    return true;
  },

  registerHandler: function(event, handler) {
    this.unregisterHandler(event);
    this._handlers[event] = handler;
  },

  unregisterHandler: function(event) {
    if (this._handlers[event]) {
      delete this._handlers[event];
    }
  },

  fireEvent: function(event) {
    var handler = this._handlers[event];
    var args = [];
    for (var i = 1; i < arguments.length; i++){
      args.push(arguments[i]);
    }
    if (handler) {
      handler.apply(handler, args);
    }
  }

});