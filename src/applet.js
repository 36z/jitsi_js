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

  ENABLE_RECOVERY_MODE: true,

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

  recoveryStore: null,

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
    try {
      this.applet.api(fn, args);
    } catch (e) {
      Jitsi.error('Jitsi.Applet.sendEvent received error handling event: ' +
                  'the applet likely crashed');
      Jitsi.log("arguments:",arguments);
      Jitsi.log("error:",e);
      if (this.ENABLE_RECOVERY_MODE)
        this._handleFailover(fn, args);
    }
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

  _createFauxCallResponse: function(fn,args) {
    if (args.length != 3) return '{}';
    return '{"package":"call", "callSetupId":"' + args[2] + '", ' +
      '"callId":"' + args[2] + '", "type":"terminated",' +
      '"details":{' +
          '"call":{"id":"' + args[2] + '","state":"Ended"},' +
          '"peers":[{"state":"recover","fn":"' + fn + '","args":"' + args + '"}]}' +
      '}';
  },

  _setTheRecoveryStatePointAndRelaunch: function(fn,args) {
      this.recoveryStore.template.failover = 'true';
      this.recoveryStore.event = {
        fn: fn,
        args: args
      };
      this.load(this.recoveryStore.template);
  },

  /**
   * Managing failover in this context means that
   * our applet no longer exists, but the UI looks to
   * be perfectly functional. When the end user tries
   * to interact with the web phone by making a call.
   * In this use case, live connect fails with a JS
   * exception. We catch the exception and create an
   * object that stores details about the call create
   * action that was taken. We then tell our frontend
   * that we're going into recovery mode as we try
   * to relaunch the applet. Once the applet comes back
   * to life it re-registers our existing user agents
   * and notifies the client that it launched, and
   * registered from a failure.
   */
  _handleFailover: function(fn, args) {
    if (this.recoveryStore && this.recoveryStore.template){
      if (fn == Jitsi.Service.Api.Calls.CREATE) {
        this.receiveEvent(this._createFauxCallResponse(fn, args));
      }
      this._setTheRecoveryStatePointAndRelaunch(fn, args);
    }
  },

  load: function(template) {
    var id = template.appletID,
      codebase = template.codebase,
      eventSink = template.globalEventReceiveFunctionName,
      recover = template.failover || '';

    var app = navigator.appName, embed_applet;
    this.recoveryStore = {
      template : template,
      event : this.recoveryStore && this.recoveryStore.event
    };

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
        '<param name="recover" value="' + recover + '" />' +
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
        '    recover="' + recover + '" ' +
        '    java_arguments="-Djnlp.packEnabled=true" ' +
        '    codebase_lookup="false" ' +
        '    callback="' + eventSink + '" >' +
        '</embed>';
    }

    var body = document.body;
    var div = document.createElement('div');

    try {
      var appletTag = document.getElementById('jitsi-applet');
      if (appletTag) {
        document.body.removeChild(appletTag);
      }
    } catch(e) {
      Jitsi.error("Errored while trying to reload the applet");
      Jitsi.log("error:",e);
    }

    div.id = 'jitsi-applet';
    div.innerHTML = '<span style="position:absolute; top:-200px; left:-200px;">' + embed_applet + '</span>';
    if (document.body.firstChild){
      body.insertBefore(div, document.body.firstChild);
    } else {
      body.appendChild(div);
    }

    this.applet = document.getElementById(id);
  }
});


