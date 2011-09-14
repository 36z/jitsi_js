
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
      local: this.peer.hold &&
        this.peer.hold.indexOf && this.peer.hold.indexOf('local') >= 0,
      remote: this.peer.hold &&
        this.peer.hold.indexOf && this.peer.hold.indexOf('remote') >= 0
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

