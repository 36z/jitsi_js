YAHOO.tool.TestRunner.add(new YAHOO.tool.TestCase(
{
  name: '***** Jitsi Service Call Tests *****',

  test_Create_Call_Service: function() {
    var Assert = YAHOO.util.Assert;
    var applet = Jitsi.Applet.extend();
    var connection = Jitsi.Connection.extend({appletAdapter: applet});
    Assert.isNotUndefined(connection.Call);
  },

  test_Registered_Call_Event_Handler: function() {
    var Assert = YAHOO.util.Assert;
    var applet = Jitsi.Applet.extend();
    var connection = Jitsi.Connection.extend({appletAdapter: applet});
    var service = connection.Call;
    Assert.isFunction(service.connection._registeredEventHandlers['call'][0]);
  },

  test_Create: function() {
    var Assert = YAHOO.util.Assert;
    var applet = Jitsi.Applet.extend();
    var connection = Jitsi.Connection.extend({appletAdapter: applet});
    var service = connection.Call;
    Assert.isFunction(service.create);
  },

  test_Hangup: function() {
    var Assert = YAHOO.util.Assert;
    var applet = Jitsi.Applet.extend();
    var connection = Jitsi.Connection.extend({appletAdapter: applet});
    var service = connection.Call;
    Assert.isFunction(service.hangup);
  },

  test_Hold: function() {
    var Assert = YAHOO.util.Assert;
    var applet = Jitsi.Applet.extend();
    var connection = Jitsi.Connection.extend({appletAdapter: applet});
    var service = connection.Call;
    Assert.isFunction(service.hold);
  },

  test_SendTone: function() {
    var Assert = YAHOO.util.Assert;
    var applet = Jitsi.Applet.extend();
    var connection = Jitsi.Connection.extend({appletAdapter: applet});
    var service = connection.Call;
    Assert.isFunction(service.sendTone);
  },

  test_Transfer: function() {
    var Assert = YAHOO.util.Assert;
    var applet = Jitsi.Applet.extend();
    var connection = Jitsi.Connection.extend({appletAdapter: applet});
    var service = connection.Call;
    Assert.isFunction(service.transfer);
  }

}));