
/** @class
 *
 *   @extends Jitsi.Base
 */
Jitsi.Service.Loader = Jitsi.Base.extend (
  /** @scope Jitsi.Service.Loader */
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

