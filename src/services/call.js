/* global Jitsi */

/** @class

  @extends Jitsi.Base
*/

Jitsi.Service.Call = Jitsi.Base.extend(
  /** @scope Jitsi.Service.Call */
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
  create: function(userId, to, setupCallId) {
    if (userId && to){
      setupCallId = setupCallId || '';
      return this.connection.sendEvent(this.api.CREATE, [userId, to, setupCallId]);
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
