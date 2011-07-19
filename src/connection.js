/**
 * EventDispatch Layer
 */
Jitsi.Connection = Jitsi.Base.extend({
  services: {
    Loader: Jitsi.Service.Loader,
    UserAgent: Jitsi.Service.UserAgent
  },

  init: function() {

  },

  /**
   * @param {Jitsi.RawEvent}
   */
  dispatchEvent: function(rawEvent) {
    var callbacks = this._findCallbacks(rawEvent),
      cbLen = callbacks.length;
    for (var i=0;i<cbLen;i++) {
      callbacks[i].call(null,rawEvent);
    }
  },

  /**
   * @param {String}
   * @param {Function}
   * @param {Object}
   * @return {Mixed} callbackId
   */
  registerEventHandler: function(packageName, callback, target) {
    return this._eventHandlersForPackage(packageName).push(function _anon_jitsiConnectionRegisteredHandler() {
      callback.apply(target,arguments);
    }) - 1;
  },

  /**
   * @param {String}
   * @param {Mixed}
   * @return {Mixed}
   */
  unregisterEventHandler: function(packageName, callbackId) {
    var callbacks = this._eventHandlersForPackage(packageName);
    callbacks[callbackId] = null; // don't shift ids
    return callbackId;
  },

  _registeredEventHandlers: null,
  _eventHandlersForPackage: function(packageName) {
    if (!this._registeredEventHandlers) {
      this._registeredEventHandlers = {};
    }

    if (!this._registeredEventHandlers[packageName]) {
      this._registeredEventHandlers[packageName] = [];
    }

    return this._registeredEventHandlers[packageName];
  },

  _findCallbacks: function(rawEvent) {
    var packageName = rawEvent['package'];
    return this._eventHandlersForPackage(packageName);
  }
});
