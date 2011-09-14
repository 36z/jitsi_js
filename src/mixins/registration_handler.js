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
