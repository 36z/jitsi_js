
/**
 * @class
 *
 * @extends Jitsi.Base
 */
Jitsi.Service.UserAgent = Jitsi.Base.extend (

  /** @scope Jitsi.Service.UserAgent */
  Jitsi.Mixin.RegistrationHandler, {

  api: Jitsi.Service.Api.Register,

  credentials: null,

  isRegistered: false,

  userId: null,

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

  register: function(username, displayName,
                     authUsername, passwd,
                     serverAddress, proxyAddress, proxyPort) {
    var params = [username, displayName, authUsername, passwd];
    this.userId = username;
    if (serverAddress) {
      params.push(serverAddress);
    }
    if (proxyAddress){
        params.push(proxyAddress);
    }
    if (proxyPort){
      params.push(proxyPort);
    }
    return this.connection.sendEvent(this.api.REGISTER, params);
  },

  unregister: function(id) {
    if(id){
      return this.connection.sendEvent(this.api.UNREGISTER, [id]);
    }
    Jitsi.error("userId was not specified");
  },

  createCall: function(to, setupCallId) {
    if (to){
      if (!this.isRegistered){
        Jitsi.warn('User agent is not registered');
      }
      if (this.userId){
        setupCallId = setupCallId || '';
        return this.connection.Call.create(this.userId, to, setupCallId);
      }
      Jitsi.error("userId was not defined");
    }
  }

});

