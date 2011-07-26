YAHOO.tool.TestRunner.add(new YAHOO.tool.TestCase(
{
  name: '***** Jitsi Connection Tests *****',

  test_Create_Connection: function() {
    var Assert = YAHOO.util.Assert;
    var applet  = Jitsi.Applet.extend();
    var connection = Jitsi.Connection.extend({appletAdapter: applet});
    Assert.isNotUndefined(connection);
  },

  test_Verify_Raw_Event_Handler: function () {
    var Assert = YAHOO.util.Assert;
    var applet = Jitsi.Applet.extend();
    var connection = Jitsi.Connection.extend({appletAdapter: applet});
    Assert.isFunction(applet._handlers['registration']);
    Assert.isFunction(applet._handlers['loader']);
    Assert.isFunction(applet._handlers['call']);
    Assert.isUndefined(applet._handlers['unkownEvent']);
  },

  test_Unknown_Raw_Event_Handler: function() {
    var Assert = YAHOO.util.Assert;
    var applet = Jitsi.Applet.extend();
    var connection = Jitsi.Connection.extend({appletAdapter: applet});
    Assert.isUndefined(applet._handlers['unkownEvent']);
  }

}));