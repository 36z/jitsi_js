YAHOO.tool.TestRunner.add(new YAHOO.tool.TestCase(
{
  name: 'Jitsi Connection Tests',

  testCreateConnection: function() {
    var Assert = YAHOO.util.Assert;
    var applet  = Jitsi.Applet.extend();
    var connection = Jitsi.Connection.extend({appletAdapter: applet});
    Assert.isNotUndefined(connection);
  },

  testVerifyRawEventHandler: function () {
    var Assert = YAHOO.util.Assert;
    var applet = Jitsi.Applet.extend();
    var connection = Jitsi.Connection.extend({appletAdapter: applet});
    Assert.isFunction(applet._handlers['registration']);
    Assert.isFunction(applet._handlers['loader']);
    Assert.isFunction(applet._handlers['call']);
    Assert.isUndefined(applet._handlers['unkownEvent']);
  },

  testUnknownRawEventHandler: function() {
    var Assert = YAHOO.util.Assert;
    var applet = Jitsi.Applet.extend();
    var connection = Jitsi.Connection.extend({appletAdapter: applet});
    Assert.isUndefined(applet._handlers['unkownEvent']);
  }

}));