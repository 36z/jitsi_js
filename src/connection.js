Jitsi.Mixin = {};

Jitsi.Service = {};

Jitsi.Mixin.RegistrationHandler = Jitsi.Base.extend({

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

  unregisterHandler: function (event) {
    if (this._registeredHandlers[event]) {
      delete this._registeredHandlers[event];
    }
  },

  fireHandler: function (event) {
    if (this._registeredHandlers[event]) {
      var action = this._registeredHandlers[event].action,
          target = this._registeredHandlers[event].target;
      action.apply(target, Array.from(arguments).slice(1));
    }
  }

});

Jitsi.Service.Api = {
  Calls: {
    CREATE: "CALL_CREATE",
    TERMINATE: "CALL_TERMINATE",
    REQUESTED: "CALL_REQUESTED",
    SEND_TONE: "SEND_TONE",
    MUTE: "MUTE",
    HOLD: "HOLD"
  },
  Register: {
    REGISTER: "REGISTER",
    UNREGISTER: "UNREGISTER"
  }
};

Jitsi.Service.Register = Jitsi.Base.extend (
  Jitsi.Mixin.RegistrationHandler, {

  api: Jitsi.Service.Api.Register,

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
    var jevt = null;
    var type = null;
    if (regEvent) {
      if (regEvent.constructor == String) {
        jevt = JSON.parse(regEvent);
      } else if (regEvent.constructor == Object) {
        jevt = regEvent;
      }
    }
    if (jevt && jevt.type) {
      type = jevt.type;
      this.fireHandler('onRegisterEvent', jevt);
      return this;
    }
    throw new Jitsi.Error("Could not parse register event");
  },

  /**
   * example:
   *   this.connection.sendEvent('register',username, pwd, ...);
   */
  register: function(username, displayName, authUsername, passwd) {
      return this.connection.sendEvent(this.api.REGISTER,
                                       [username, displayName,
                                        authUsername, passwd]);
  },

  unregister: function() {
    return this.connection.sendEvent(this.api.UNREGISTER, []);
  }

});

Jitsi.Service.Call = Jitsi.Base.extend(Jitsi.Mixin.RegistrationHandler,
{
  api: Jitsi.Service.Api.Calls,

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
    var jevt = null;
    var type = null;
    if (callEvent) {
      if (callEvent.constructor == String) {
        jevt = JSON.parse(callEvent);
      } else if (callEvent.constructor == Object) {
        jevt = callEvent;
      }
    }
    if (jevt && jevt.type) {
      type = jevt.type;
      this.fireHandler('onCallEvent', jevt);
      return this;
    }
    throw new Jitsi.Error("Could not parse callEvent");
  },

  /**
   * Make a call
   * @param {String} SIP Uri
   */
  create: function(sip) {
    return this.connection.sendEvent(this.api.CREATE, [sip]);
  },

  /**
   * Hang-up a call
   */
  hangup: function() {
    // TODO: support peerId
    return this.connection.sendEvent(this.api.HANGUP, []);
  },

  /**
   * Hold
   */
  hold: function(bHold) {
    if (bHold){
      bHold = bHold.toString().trim();
      if (bHold == 'true' || bHold == 'false'){
        return this.connection.sendEvent(this.api.HOLD, [bHold]);
      }
    }
    throw new Jitsi.Error('Invalid parameter for hold , should be boolean');
  },

  /**
   * DTMF tones
   */
  sendTone: function(key) {
    if(key){
      key = key.toString().charAt(0);
      if(/[0-9]|\*|\#/.test(key)){
        return this.connection.sendEvent(this.api.SEND_TONE, [key]);
      }
    }
    throw new Jitsi.Error('Invalid parameter key for sendTone');
  },

  transfer: function() {
    throw new Jitsi.Error("Future Implementation");
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
  _handleLoadEvents: function(loadEvent) {
    var jevt = null;
    var type = null;
    if (loadEvent) {
      if (loadEvent.constructor == String) {
        jevt = JSON.parse(loadEvent);
      } else if (loadEvent.constructor == Object) {
        jevt = loadEvent;
      }
    }
    if (jevt && jevt.type) {
      type = jevt.type;
      this.fireHandler('onLoadEvent', jevt);
      return this;
    }
    throw new Jitsi.Error("Could not parse loadEvent");
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
    return this.appletAdapter.sendEvent(event);
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
