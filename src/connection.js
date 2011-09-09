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
    INVITE: "INVITE",
    TRANSFER: "TRANSFER_CALL",
    SEND_TONE: "SEND_TONE",
    MUTE: "MUTE",
    HOLD: "HOLD"
  },
  Register: {
    REGISTER: "REGISTER",
    UNREGISTER: "UNREGISTER"
  }
};

Jitsi.Service.UserAgent = Jitsi.Base.extend (
  Jitsi.Mixin.RegistrationHandler, {

  api: Jitsi.Service.Api.Register,

  credentials: null,

  isRegistered: false,

  init: Jitsi.Function.around(
    function($super) {
      if (this.connection){
        this.connection.registerEventHandler("registration",
                                             this._handleRegisterEvents,
                                             this);
        if (this.credentials){
          var c = this.credentials;
          if (c.userId && c.authUsername &&
              c.password && c.displayName){

            this.register(c.userId, c.displayName,
                          c.authUsername, c.password,
                          c.serverAddress, c.proxyAddress,
                          c.proxyPort);
          }
        }
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
        this.isRegistered = (type == 'registered');
        this.fireHandler('onRegisterEvent', this.makeUserAgentItem(jevt));
        return this;
      }
    }
    Jitsi.error("Could not parse register event");
  },

  makeUserAgentItem: function(data) {
    var uaItem = Jitsi.Service.UserAgent.Item.extend({
      service: this,
      data: data
    });
    return uaItem;
  },

  register: function(username, displayName, authUsername, passwd,
      serverAddress, proxyAddress, proxyPort) {
    var params = [username, displayName, authUsername, passwd];
    if (serverAddress) {
      params.push(serverAddress);
      if (proxyAddress){
        params.push(proxyAddress);
        if (proxyPort){
          params.push(proxyPort);
        }
      }
    }
    return this.connection.sendEvent(this.api.REGISTER, params);
  },

  unregister: function() {
    return this.connection.sendEvent(this.api.UNREGISTER, []);
  },

  createCall: function(to, setupCallId) {
    if (to){
      if (!this.isRegistered){
        Jitsi.warn('UserAgent is not registered');
      }
      setupCallId = setupCallId || '';
      return this.connection.Call.create(to,setupCallId);
    }
  }

});

Jitsi.Service.UserAgent.Item = Jitsi.Base.extend({
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

  makeCallItems: function(data) {
    var ret = [];
    if (!data) return ret;
    var details = data.details || {};
    var peers = details.peers || [];
    for (var i=0;i<peers.length;i++) {
      ret.push(Jitsi.Service.Call.Item.extend({
        service: this,
        data: data,
        peer: peers[i]
      }));
    }

    return ret;
  },

  _handleCallEvents: function(callEvent) {
    if (!callEvent) {
      Jitsi.error("Could not parse callEvent");
      return;
    }
    var jevt = null;
    var type = null;
    var items = this.makeCallItems(callEvent);
    for (var i=0;i<items.length;i++) {
      this.fireHandler('onCallEvent', items[i]);
    }
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
    Jitsi.error("Invalid to SIP address, can't make call");
  },

  /**
   * Answer call
   *
   * @param {String} callId answer a call by callId
   */
  answer: function(callId) {
    var params = [];
    if (callId){
      params.push(callId);
    }
    return this.connection.sendEvent(this.api.REQUESTED, params);
  },

  /**
   * Hang-up a call
   *
   * @param {String} callId optional callId to hangup on call
   * @param {String} peerId optional peerId to hangup on peer
   */
  hangup: function(callId, peerId) {
    var params = [];
    if (callId) {
      params.push(callId);
      if (peerId) {
        params.push(peerId);
      }
    }
    return this.connection.sendEvent(this.api.TERMINATE, params);
  },

  mute: function(mute, callId) {
    var params = [];
    if (callId) {
      params.push(callId);
    }
    params.push(!!mute);
  },

  /**
   * Hold
   *
   * @param {Boolean} hold required put on hold, take off hold
   * @param {String} callId optional callId to put a call on hold
   * @param {String} peerId optional peerId to put peer on hold
   */
  hold: function(hold, callId, peerId) {
    var params = [];
    if (callId) {
      params.push(callId);
      if (peerId) {
        params.push(peerId);
      }
    }
    params.push(!!hold);
    return this.connection.sendEvent(this.api.HOLD, params);
  },

  /**
   * DTMF tones
   */
  sendTone: function(callId, key) {
    var params = [];
    if(key){
      key = key.toString().charAt(0);
      if(/[0-9]|\*|\#/.test(key)){
        if (callId){
          params.push(callId);
        }
        params.push(key);
        Jitsi.log("params: " + params);
        return this.connection.sendEvent(this.api.SEND_TONE, params);
      }
    }
    Jitsi.error('Invalid parameter key for sendTone');
  },

  transfer: function(callId, peerId, targetUri) {
    var params = [];
    if (callId) {
      params.push(callId);
      if (peerId) {
        params.push(peerId);
        if (targetUri) {
          params.push(targetUri);
          return this.connection.sendEvent(this.api.TRANSFER, params);
        }
      }
    }
    Jitsi.error('Invalid parameter set in transfer');
  },

  inviteCalleeToCall: function(callId, targetUri) {
    var params = [];
    if (callId) {
      params.push(callId);
      if (targetUri) {
        params.push(targetUri);
        return this.connection.sendEvent(this.api.INVITE, params);
      }
    }
    Jitsi.error('Invalid parameter set in inviteCalleeToCall');
  }

});

Jitsi.Service.Call.Item = Jitsi.Base.extend({
  service: null,

  data: null,

  call: null,

  peer: null,

  /**
   *
   * @type String
   */
  callId: null,

  init: function(){
    var details;
    if (this.data){
      this.callId = this.data.callId;
      if (this.data.details) {
        details = this.data.details;
        this.call = details.call;
      }
      this._buildPeer();

      this.type = this.data.type;
    }
  },

  _buildPeer: function() {
    if (!this.peer) return;

    this.peer.hold = {
      local: this.peer.hold && this.peer.hold.indexOf && this.peer.hold.indexOf('local') >= 0,
      remote: this.peer.hold && this.peer.hold.indexOf && this.peer.hold.indexOf('remote') >= 0
    };
    this.peer.mute = (this.peer.mute === "true");

    // replace duration (unix timestamp as String) with startTime as Date object
    // TODO: jitsi events need to be more consistent w/ duration field
    // (among others) - e.g. terminated events
    if (parseInt(this.peer.duration)) {
      this.peer.startTime = new Date();
      this.peer.startTime.setTime(parseInt(this.peer.duration));
      delete this.peer.duration;
    }
  },

  /**
   * @param {String} a URI
   * @return {Object}
   */
  parseURI: function(uri) {
    if (!uri) {
      throw new Error("Unable to parse nonexistant URI");
    }

    var ret = {
      uri: uri,
      protocol: null,
      userinfo: null,
      domain: null,
      address: null,
      parametersRaw: null,
      parameters: []
    };

    // TODO: this certainly isn't a perfect pattern
    var sipURIPattern = /^(sip[s]?):([^@]+)@([^;]+)(?:[;](.*))?$/;
    var matches = ret.uri.match(sipURIPattern);

    if (matches) {
      ret.protocol      = matches[1];
      ret.userinfo      = matches[2];
      ret.domain        = matches[3];
      ret.parametersRaw = matches[4];
      ret.address       = [matches[2],matches[3]].join("@");
    }

    if (ret.parametersRaw) {
      var paramPairs = ret.parametersRaw.split(';'), pair;
      for (var i=0; i<paramPairs.length; i++) {
        pair = paramPairs[i].split("=");
        ret.parameters[pair[0]] = pair[1];
      }
    }

    return ret;
  },

  hangup: function(peerId){
    this.service.hangup(this.callId, peerId);
  },
  hold: function(hold, peerId){
    this.service.hold(hold, this.callId, peerId);
  },
  answer: function(){
    this.service.answer(this.callId);
  },
  sendTone: function(key){
    this.service.sendTone(this.callId, key);
  },
  mute: function(mute){
    this.service.mute(this.callId, mute);
  },
  transfer: function(peerId, targetUri){
    this.service.transfer(this.callId, peerId, targetUri);
  },
  inviteCalleeToCall: function(targetUri){
    this.service.inviteCalleeToCall(this.callId, targetUri);
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
        return this.fireHandler('onLoadEvent', this.makeLoadItem(loadEvent));
      }
    }
    Jitsi.error("Could not parse loadEvent");
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
    UserAgent: Jitsi.Service.UserAgent,
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

        var dispatch = function (rawEvent) {
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
    if (this._eventHandlersForPackage(packageName).length == 0) {
      return this._eventHandlersForPackage(packageName).push(
        function _anon_jitsiConnectionRegisteredHandler() {
          callback.apply(target,arguments);
        }) - 1;
    }
    return -1;
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
    Jitsi.error("The applet returned bad data, " +
                "no package property found");
  }
});
