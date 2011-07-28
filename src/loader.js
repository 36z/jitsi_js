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
   *  load: function() {},
   *  onLoading: function() {},
   *  onLoaded: function() {}
   *
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