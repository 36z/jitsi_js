YAHOO.tool.TestRunner.add(new YAHOO.tool.TestCase(
{
  name: 'Jitsi Service Register Tests',

  test_Create_Register_Service: function() {
    var Assert = YAHOO.util.Assert;
    var adapter = Jitsi.AppletAdapter.extend();
    var connection = Jitsi.Connection.extend({appletAdapter: adapter});
    Assert.isNotUndefined(connection.Register);
  },

  test_Registered_Register_Event_Handler: function() {
    var Assert = YAHOO.util.Assert;
    var adapter = Jitsi.AppletAdapter.extend();
    var connection = Jitsi.Connection.extend({appletAdapter: adapter});
    var service = connection.Register;
    Assert.isFunction(service.connection._registeredEventHandlers['registration'][0]);
  },

  test_Register: function() {
    var Assert = YAHOO.util.Assert;
    var adapter = Jitsi.AppletAdapter.extend();
    var connection = Jitsi.Connection.extend({appletAdapter: adapter});
    var service = connection.Register;
    Assert.isFunction(service.register);
  },

  test_Unregister: function() {
    var Assert = YAHOO.util.Assert;
    var adapter = Jitsi.AppletAdapter.extend();
    var connection = Jitsi.Connection.extend({appletAdapter: adapter});
    var service = connection.Register;
    Assert.isFunction(service.unregister);
  }

}));