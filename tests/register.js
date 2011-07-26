YAHOO.tool.TestRunner.add(new YAHOO.tool.TestCase(
{
  name: 'Jitsi Service Register Tests',

  testCreateRegisterService: function() {
    var Assert = YAHOO.util.Assert;
    var applet = Jitsi.Applet.extend();
    var connection = Jitsi.Connection.extend({appletAdapter: applet});
    Assert.isNotUndefined(connection.Register);
  },

  testRegisteredRegisterEventHandler: function() {
    var Assert = YAHOO.util.Assert;
    var applet = Jitsi.Applet.extend();
    var connection = Jitsi.Connection.extend({appletAdapter: applet});
    var service = connection.Register;
    Assert.isFunction(service.connection._registeredEventHandlers['registration'][0]);
  },

  testRegister: function() {
    var Assert = YAHOO.util.Assert;
    var applet = Jitsi.Applet.extend();
    var connection = Jitsi.Connection.extend({appletAdapter: applet});
    var service = connection.Register;
    Assert.isFunction(service.register);
  },

  testUnregister: function() {
    var Assert = YAHOO.util.Assert;
    var applet = Jitsi.Applet.extend();
    var connection = Jitsi.Connection.extend({appletAdapter: applet});
    var service = connection.Register;
    Assert.isFunction(service.unregister);
  }

}));