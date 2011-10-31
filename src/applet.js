/**
 * Example:
 * --------
 *
 * var applet = Jitsi.Applet.extend();
 * var Jitsi.UA = Jitsi.Connection.extend({appletAdapter: applet});
 *
 * Jitsi.UA.Register.registerHandler('onRegistered', function(regEvent){});
 * Jitsi.UA.Register.registerHandler('onRegistering',function(regEvent){});
 *
 * Jitsi.UA.Call.registerHandler('onCallCreated', function(callEvent){});
 * Jitsi.UA.Call.create('sip:1732222');
 *
 *
 * Applet <=> DOM bridge
 */

/**
function receiveJitsiEvent(rawEvent) {
  DemoApp.Jitsi.applet.appletAdapter.receiveEvent(rawEvent);
}
**/

Jitsi.Applet = Jitsi.Base.extend({
  /**
   *  the id of the applet DOM element
   */
  appletID: null,

  codebase: function(location) {
    var host = location.host;
    var proto = location.protocol;
    var cb = (Jitsi.Archive &&
              Jitsi.Archive.codebase &&
              Jitsi.Archive.codebase.length > 0) ?
      Jitsi.Archive.codebase : [proto,host].join("//");
    return cb;
  }(window.location),

  applet: null,

  globalEventReceiveFunctionName: 'receiveJitsiEvent',

  _handlers: null,

  init: Jitsi.Function.around(
    function($super) {
      this._handlers = {};
      var that = this;
      if (this.appletID && this.globalEventReceiveFunctionName) {
        window[this.globalEventReceiveFunctionName] = function() {
          return that.receiveEvent.apply(that, arguments);
        };
        this.load(this);
      }
      if (Jitsi.isFunction($super)) {
        $super.apply(this, Array.from(arguments).slice(-1));
      }
    }
  ),

  /**
   * applet => javascript
   *
   * Fire the callback function
   * in _handlers. The target of the
   * event  exists in Jitsi.Connection
   */
  receiveEvent: function(rawEvent) {
    try {
      var rawJsonEvt = JSON.parse(rawEvent);
      for(var h in this._handlers) {
        if(this._handlers.hasOwnProperty(h)){
          this._handlers[h].call(null, rawJsonEvt);
        }
      }
    } catch(e) {
      Jitsi.error('Jitsi.Applet.receiveEvent received error handling event');
      Jitsi.log("arguments:",arguments);
      Jitsi.log("error:",e);
    }
  },

  /**
   * javascript => applet
   *
   * Fires the event into the applet
   */
  sendEvent: function(fn, args) {
    Jitsi.log('sendEvent: ' + arguments);
    this.applet.api(fn, args);
  },

  registerHandler: function(event, handler) {
    this.unregisterHandler(event);
    this._handlers[event] = handler;
  },

  unregisterHandler: function(event) {
    if (this._handlers[event]) {
      delete this._handlers[event];
    }
  },

  load: function(template) {
    var id = template.appletID,
      codebase = template.codebase,
      eventSink = template.globalEventReceiveFunctionName;

    var app = navigator.appName, embed_applet;

    // TODO: fix browser detection
    if (app == 'Microsoft Internet Explorer') {
      embed_applet = '' +
        '<object classid="clsid:E19F9331-3110-11d4-991C-005004D3B3DB" ' +
        '  width="5" height="5" name="' + id + '" id="' + id + '"' +
        '  codebase="http://java.sun.com/update/1.6.0/jinstall-6u25-windows-i586.cab/#Version=1,6,0,25"> ' +
        '<param name=code value=com.onsip.felix.AppletLauncher.class>' +
        '<param name="archive" value="GraphicalUAApp.jar">' +
        '<param name="codebase" value="' + codebase + '">' +
        '<param name=name value="' + id + '">' +
        '<param name="MAYSCRIPT" value="true">' +
        '<param name="type" VALUE="application/x-java-applet">' +
        '<param name="scriptable" VALUE="true">' +
        '<param name="callback" value="receiveJitsiEvent" />' +
        '<param name="java_arguments" value="-Djnlp.packEnabled=true" />' +
        '<comment>' +
        '  <embed type="application/x-java-applet;jpi-version=1.6.0_24" mayscript ' +
        '    code=com.onsip.felix.AppletLauncher.class archive="GraphicalUAApp.jar" ' +
        '    name="apua" width="5" height="5"> ' +
        '    <param name="mayscript" value="mayscript" />' +
        '    <param name="type" value="application/x-java-applet" />' +
        '    <param name="scriptable" value="true" />' +
        '  </embed>' +
        '</comment>' +
        '</object>';
    } else {
      <!-- Jitsi.Applet -->
      embed_applet = '' +
        '<embed type="application/x-java-applet" mayscript ' +
        '    codebase="' + codebase + '"' +
        '    code="com.onsip.felix.AppletLauncher.class" ' +
        '    archive="GraphicalUAApp.jar" name="' + id + '"' +
        '    id="' + id + '" width="5" height="5" ' +
        '    server_address="" ' +
        '    proxy_address="" ' +
        '    proxy_port="" ' +
        '    java_arguments="-Djnlp.packEnabled=true" ' +
        '    codebase_lookup="false" ' +
        '    callback="' + eventSink + '" >' +
        '</embed>';
    }

    var body = document.body;
    var div = document.createElement('div');
    div.id = 'jitsi-applet';
    div.innerHTML = embed_applet;
    if (document.body.firstChild){
      body.insertBefore(div, document.body.firstChild);
    } else {
      body.appendChild(div);
    }

    this.applet = document.getElementById(id);
  }
});


