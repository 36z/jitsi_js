/**
 * Applet <=> DOM bridge
 */
Jitsi.Applet = Jitsi.Base.extend({

  /* the id of the applet DOM element */
  appletID: null,

  globalEventReceiveFunctionName: 'receiveJitsiEvent',

  /* the function called by the applet when the applet has data for javascript */
  receiveEvent: function(rawEvent) { throw new Error("Not implemented"); },

  /* the function called by javascript to send data to the applet */
  sendEvent: function(rawEvent) { throw new Error("Not implemented"); },

  init: function($super) {
    $super.apply(this, Array.from(arguments).slice(-1));
    if (this.appletID && this.globalEventReceiveFunctionName) {
      window[this.globalEventReceiveFunctionName] = this.receiveEvent;
      this.load(this);
    }
  }.around(),

  load: function(template) {
    var id = template.appletID,
      eventSink = template.globalEventReceiveFunctionName;

    var app = navigator.appName, s;

    // TODO: fix browser detection
    if (app == 'Microsoft Internet Explorer') {
      s = '<object classid="clsid:E19F9331-3110-11d4-991C-005004D3B3DB" ' +
          ' width="5" height="5" name="' + id + '" id="' + id +'" codebase="http://java.sun.com/update/1.6.0/jinstall-6u25-windows-i586.cab/#Version=1,6,0,25"> ' +
          '<param name=code value=com.onsip.felix.AppletLauncher.class>' +
          '<param name=archive value="GraphicalUAApp.jar">' +
          '<param name=name value="' + id +'">' +
          '<param name="event-sink" value="' + eventSink +'">' +
          '<param name="MAYSCRIPT" value="true">' +
          '<param name="type" VALUE="application/x-java-applet">' +
          '<param name="scriptable" VALUE="true">' +
          '<comment>' +
          '<embed type="application/x-java-applet;jpi-version=1.6.0_24" mayscript ' +
          'code=com.onsip.felix.AppletLauncher.class archive="GraphicalUAApp.jar" ' +
          'name="apua" width="5" height="5"> ' +
          '<param name="mayscript" value="mayscript" />' +
          '<param name="type" value="application/x-java-applet" />' +
          '<param name="scriptable" value="true" />' +
          '</embed>' +
          '</comment>' +
          '</object>';
        } else {
          s = '<embed type="application/x-java-applet" mayscript ' +
            'code=com.onsip.felix.AppletLauncher.class archive="GraphicalUAApp.jar" ' +
            'name="' + id +'" id="' + id +'" width="5" height="5"> ' +
            '<param name="event-sink" value="' + eventSink +'">' +
            '<param name="mayscript" value="mayscript" />' +
            '<param name="type" value="application/x-java-applet" />' +
            '<param name="scriptable" value="true" />' +
            '<param name="classloader_cache" value="false" />' +
            '<param name="codebase_lookup" value="false" />' +
            '</embed>';
        }
    var body = document.body;
  }
});
