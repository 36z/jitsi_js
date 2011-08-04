Jitsi.Mixin = {};

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

Jitsi.Service = {};

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
      if (type.constructor == String){
        this.fireHandler('onRegisterEvent', this.makeUserAgentItem(jevt));
        return this;
      }
    }
    throw new Jitsi.Error("Could not parse register event");
  },

  makeUserAgentItem: function(data) {
    var uaItem = Jitsi.Service.Register.Item.extend({
      service: this,
      data: data
    });
    return uaItem;
  },

  /**
   * example:
   *   this.connection.sendEvent('register',username, pwd, ...);
   */
  register: function(username, displayName, authUsername, passwd) {
    var args = [username, displayName, authUsername, passwd];
    return this.connection.sendEvent(this.api.REGISTER, args);
  },

  unregister: function() {
    return this.connection.sendEvent(this.api.UNREGISTER, []);
  }

});

Jitsi.Service.Register.Item = Jitsi.Base.extend({
  service: null,
  data: null,
  unregister: function(){
    this.service.unregister();
  }
});

Jitsi.Service.Call = Jitsi.Base.extend(
  Jitsi.Mixin.RegistrationHandler, {

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

  makeCallItem: function(data) {
    var callItem = Jitsi.Service.Call.Item.extend({
      service: this,
      data: data
    });
    return callItem;
  },

  _handleCallEvents: function(callEvent) {
    var jevt = null;
    var type = null;
    if (callEvent) {
      if (callEvent.type) {
        return this.fireHandler('onCallEvent', this.makeCallItem(callEvent));
      }
    }
    throw new Jitsi.Error("Could not parse callEvent");
  },

  /**
   * Make a call
   *
   * @param {String} to the SIP address
   * @param {String} setupCallId binds the create call request
   *                             to call publish events
   */
  create: function(to, setupCallId) {
    if (to){
      setupCallId = setupCallId || '';
      return this.connection.sendEvent(this.api.CREATE, [to, setupCallId]);
    }
    throw new Jitsi.Error("Invalid to SIP address, can't make call");
  },

  answer: function() {
    return this.connection.sendEvent(this.api.REQUESTED, []);
  },

  /**
   * Hang-up a call
   */
  hangup: function() {
    // TODO: support peerId
    return this.connection.sendEvent(this.api.TERMINATE, []);
  },

  /**
   * Hold
   */
  hold: function(hold) {
    if (hold){
      return this.connection.sendEvent(this.api.HOLD, [hold]);
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

Jitsi.Service.Call.Item = Jitsi.Base.extend({
  service: null,

  data: null,

  /**
   *
   * @type String
   */
  callID: null,

  init: function(){
    if (this.data){
      this.callID = this.data['call-id'];
    }
  },
  hangup: function(){
    this.service.hangup();
  },
  hold: function(hold){
    this.service.hold(hold);
  },
  answer: function(){
    this.service.answer();
  },
  sendTone: function(key){
    this.service.sendTone(key);
  },
  mute: function(mute){
    this.service.mute(mute);
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

  makeLoadItem: function(data) {
    var item = Jitsi.Service.Loader.Item.extend({
      service: this,
      data: data
    });
    return item;
  },

  _handleLoadEvents: function(loadEvent) {
    if (loadEvent) {
      if (loadEvent.type){
        return this.fireHandler('onLoadEvent', makeLoadItem(loadEvent));
      }
    }
    throw new Jitsi.Error("Could not parse loadEvent");
  }
});

Jitsi.Service.Loader.Item = Jitsi.Base.extend({
  service: null,

  data: null,

  progress: null,

  type: null,

  init: function(){
    if (this.data){
      this.progress = this.data.details.progress;
      this.progress = isNaN(this.progress) ? 0: this.progress;
      this.type = this.data.type;
    }
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
         * pass the event up to one of the services.
         * The appropriate service will be identified
         * in the data passed from the applet.
         */
        var that = this;
        var events = ['packages'];

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
  sendEvent: function(fn, args) {
    return this.appletAdapter.sendEvent(fn, args);
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
    if (rawEvent && rawEvent['package']){
      var packageName = rawEvent['package'];
      if (packageName.constructor == String){
        return this._eventHandlersForPackage(packageName);
      }
    }
    throw new Jitsi.Error("The applet returned bad data, " +
                          "no package property found");
  }
});
