YAHOO.tool.TestRunner.add(new YAHOO.tool.TestCase(
{
  name: 'Jitsi Service Call Tests',

  testCreateCallService: function() {
    var Assert = YAHOO.util.Assert;
    var applet = Jitsi.Applet.extend();
    var connection = Jitsi.Connection.extend({appletAdapter: applet});
    Assert.isNotUndefined(connection.Call);
  },

  testRegisteredCallEventHandler: function() {
    var Assert = YAHOO.util.Assert;
    var applet = Jitsi.Applet.extend();
    var connection = Jitsi.Connection.extend({appletAdapter: applet});
    var service = connection.Call;
    Assert.isFunction(service.connection._registeredEventHandlers['call'][0]);
  },

  testCreate: function() {
    var Assert = YAHOO.util.Assert;
    var applet = Jitsi.Applet.extend();
    var connection = Jitsi.Connection.extend({appletAdapter: applet});
    var service = connection.Call;
    Assert.isFunction(service.create);
  },

  testHangup: function() {
    var Assert = YAHOO.util.Assert;
    var applet = Jitsi.Applet.extend();
    var connection = Jitsi.Connection.extend({appletAdapter: applet});
    var service = connection.Call;
    Assert.isFunction(service.hangup);
  },

  testHold: function() {
    var Assert = YAHOO.util.Assert;
    var applet = Jitsi.Applet.extend();
    var connection = Jitsi.Connection.extend({appletAdapter: applet});
    var service = connection.Call;
    Assert.isFunction(service.hold);
  },

  testSendTone: function() {
    var Assert = YAHOO.util.Assert;
    var applet = Jitsi.Applet.extend();
    var connection = Jitsi.Connection.extend({appletAdapter: applet});
    var service = connection.Call;
    Assert.isFunction(service.sendTone);
  },

  testTransfer: function() {
    var Assert = YAHOO.util.Assert;
    var applet = Jitsi.Applet.extend();
    var connection = Jitsi.Connection.extend({appletAdapter: applet});
    var service = connection.Call;
    Assert.isFunction(service.transfer);
  }

}));