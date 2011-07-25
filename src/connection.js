Jitsi.Mixin = {};

Jitsi.Service = {};

Jitsi.Mixin.RegistrationHandler = {

  init: Jitsi.Function.around(
    function($super) {
      var tmp = {};
      if (this._registeredHandlers) {
        tmp = Jitsi.Base.extend(this._registeredHandlers);
      }
      this._registeredHandlers = tmp;

      if (Jitsi.isFunction($super)) {
        $super.apply(this, Array.from(arguments).slice(1));
      }
    }
  ),

  /**
   * Register a callback handler for a named event.
   * it is the responsibility of the caller of this function
   * to either properly bind callbacks or provide a target
   * scope to apply to the callback.
   *
   * @param {String} event Event name
   * @param {Function} callback Function to fire as the callback
   * @param {Object} [target] Object to which 'this' will be bound
   *
   * @returns {Boolean} True indicates success
   *
   */
  registerHandler: function (event, callback, target) {
    if (!Jitsi.isFunction(callback)) {
      return false;
    }

    this._registeredHandlers[event] = {
      action: callback,
      target: target || this
    };

    return true;
  },

  fireHandler: function (event) {
    if (this._registeredHandlers[event]) {
      var action = this._registeredHandlers[event].action,
          target = this._registeredHandlers[event].target;
      action.apply(target, Array.from(arguments).slice(1));
    }
  }

};


Jitsi.Service.Register = Jitsi.Base.extend (
  Jitsi.Mixin.RegistrationHandler, {

  init: Jitsi.Function.around(
    function($super) {
      if (this.connection){
        this.connection.registerEventHandler("registration",
                                             this._handleRegisterEvents,
                                             this);
      }

      if (Jitsi.isFunction($super)) {
        $super.apply(this, Array.from(arguments).slice(1));
      }
    }
  ),

  /**
   *   -- registration callbacks
   *   onRegistered: function(regEvent) {},
   *   onUnregistered: function(regEvent) {},
   *   onRegistering: function(regEvent) {},
   *
   *  example:
   *   this.fireHandler('onRegistered',args)
   */
  _handleRegisterEvents: function(regEvent) {
    throw new Error("Must Implement");
  },

  /**
   * example:
   *   this.connection.sendEvent('register',username, pwd, ...);
   */
  register: function() {
    throw new Error("Must Implement");
  },

  unregister: function() {
    throw new Error("Must Implement");
  }

});


Jitsi.Service.Call = Jitsi.Base.extend (
  Jitsi.Mixin.RegistrationHandler, {

  init: Jitsi.Function.around(
    function($super) {
      if (this.connection){
        this.connection.registerEventHandler("call",
                                             this._handleCallEvents,
                                             this);
      }

      if (Jitsi.isFunction($super)) {
        $super.apply(this, Array.from(arguments).slice(1));
      }
    }
  ),

  /**
   * -- call callbacks
   * onCallCreated: function(callEvent) {},
   * onCallRequested: function(callEvent) {},
   * onCallConfirmed: function(callEvent) {},
   * onCallEnded: function(callEvent) {},
   *
   * -- future
   * onHold: function(callEvent) {},
   *
   * example:
   *   this.fireHandler('onCallCreated',args)
   *
   */
  _handleCallEvents: function(callEvent) {
    throw new Error("Must Implement");
  },

  /**
   * example:
   *   this.connection.sendEvent('create',sip);
   */
  create: function(sip) {
    throw new Error("Must Implement");
  },

  /**
   * example:
   *   this.connection.sendEvent('hangup',peerId);
   */
  hangup: function() {
    throw new Error("Must Implement");
  },

  hold: function() {
    throw new Error("Must Implement");
  },

  transfer: function() {
    throw new Error("Must Implement");
  },

  sendTone: function(key) {
    throw new Error("Must Implement");
  }
});

Jitsi.Service.Loader = Jitsi.Base.extend (
  Jitsi.Mixin.RegistrationHandler, {

  init: Jitsi.Function.around(
    function($super) {
      if (this.connection){
        this.connection.registerEventHandler("loader",
                                             this._handleLoadEvents,
                                             this);
      }

      if (Jitsi.isFunction($super)) {
        $super.apply(this, Array.from(arguments).slice(1));
      }
    }
  ),

  /**
   * -- loader callbacks
   * load: function() {},
   * onLoading: function() {},
   * onLoaded: function() {}
   *
   * example:
   *   this.fireHandler('onLoading',args)
   */
  _handleLoadEvents: function() {
    throw new Error("Must Implement");
  }
});

/**
 * EventDispatch Layer
 */
Jitsi.Connection = Jitsi.Base.extend({
  services: {
    Loader: Jitsi.Service.Loader,
    Register: Jitsi.Service.Register,
    Call: Jitsi.Service.Call
  },

  init: Jitsi.Function.around(
    function($super) {
      if (this.appletAdapter) {
        for (var s in this.services) {
          if (this.services.hasOwnProperty(s)) {
            var service = this.services[s];
            this[s] = service.extend({connection: this});
          }
        }

        /**
         * Register events with the appletAdapter.
         * When the applet fires events into the
         * JS appletAdapter's receiveEvent function
         * that function will pass details of the
         * event into dispatch. dispatch will then
         * pass the event up to one of the 3 services
         */
        var that = this;
        var events = ['call', 'registration', 'loader'],

        dispatch = function (rawEvent) {
          that._dispatchEvent(rawEvent);
          return true;
        };

        for (var i = 0; i < events.length; i++) {
          this.appletAdapter.registerHandler(events[i], dispatch);
        }
      }

      if (Jitsi.isFunction($super)) {
        $super.apply(this, Array.from(arguments).slice(1));
      }
    }
  ),

  /**
   * @param {Jitsi.RawEvent}
   */
  _dispatchEvent: function(rawEvent) {
    var callbacks = this._findCallbacks(rawEvent),
      cbLen = callbacks.length;
    for (var i=0;i<cbLen;i++) {
      callbacks[i].call(null,rawEvent);
    }
  },

  /**
   * Make a call into the applet via the appletAdapter
   */
  sendEvent: function(event) {
    this.appletAdapter.sendEvent(event);
  },

  /**
   * @param {String}
   * @param {Function}
   * @param {Object}
   *
   * @return {Mixed} callbackId
   */
  registerEventHandler: function(packageName, callback, target) {
    return this._eventHandlersForPackage(packageName).push(
      function _anon_jitsiConnectionRegisteredHandler() {
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
