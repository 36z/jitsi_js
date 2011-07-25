/* global Jitsi */

/** @namespace

  DOCUMENTATION FOR JITSI GLOBAL NAMESPACE

 */
Jitsi = {

  /**
    Loads the Jitsi applet.

    To be notified when the applet is loaded, provide
    a function callback, which will be called once
    the applet has completely loaded.

    Note that Jitsi is unusable until the applet has
    completely finished loading.

    @param {Function} onLoaded Called when the applet has finished loading.
    @param {Function} onFailed Called when the applet has failed loading.
    @returns {void}
   */
  load: function (onLoaded, onFailed) {

  },

  /**
   * Prints a debug message to the console, if window.console exists.
   * @returns {void}
   */
  debug: function () {
    return window.console && window.console.debug &&
      window.console.debug.apply &&
      window.console.debug.apply(window.console, arguments);
  },

  /**
   * Prints a log to the console, if window.console exists.
   * @returns {void}
   */
  log: function () {
    return window.console && window.console.log &&
      window.console.warn.apply &&
      window.console.log.apply(window.console, arguments);
  },

  /**
   * Prints a warning to the console, if window.console exists.
   * @returns {void}
   */
  warn: function () {
    return window.console &&
      window.console.warn && window.console.warn.apply &&
      window.console.warn.apply(window.console, arguments);
  },

  /**
   * Prints an error to the console, if window.console exists.
   * @returns {void}
   */
  error: function () {
    return window.console && window.console.error &&
      window.console.error.apply &&
      window.console.error.apply(window.console, arguments);
  },

  /**
   * Begins a console group, if it's able to; otherwise it tries to print a log.
   * @returns {void}
   */
  group: function () {
    if (window.console && window.console.group) {
      window.console.group.apply(window.console, arguments);
    } else {
      XC.log.apply(XC, arguments);
    }
  },

  /**
   * End a console group.
   * @returns {void}
   */
  groupEnd: function () {
    if (window.console && window.console.groupEnd) {
      window.console.groupEnd();
    }
  },

  /**
   * Returns whether or not the Object passed in
   * is a function.
   *
   * @param {Object} o The Object to test.
   * @returns {Boolean} True if the Object is a function, false otherwise.
   */
  isFunction: function (o) {
    return (/function/i).test(Object.prototype.toString.call(o));
  },

  /**
   * Returns whether or not the Object passed in
   * is a String.
   *
   * @param {Object} o The Object to test.
   * @returns {Boolean} True if the Object is a String, false otherwise.
   */
  isString: function (o) {
    return (/string/i).test(Object.prototype.toString.call(o));
  }
};

JT = Jitsi;
