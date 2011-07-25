YAHOO.tool.TestRunner.add(new YAHOO.tool.TestCase(
{
  name: 'Jitsi Connection Tests',

  test_Create_Connection: function() {
    var Assert = YAHOO.util.Assert;
    var adapter = Jitsi.AppletAdapter.extend();
    var connection = Jitsi.Connection.extend({appletAdapter: adapter});
    Assert.isNotUndefined(connection);
  },

  test_Verify_Raw_Event_Handler: function () {
    var Assert = YAHOO.util.Assert;
    var adapter = Jitsi.AppletAdapter.extend();
    var connection = Jitsi.Connection.extend({appletAdapter: adapter});
    Assert.isFunction(adapter._handlers['registration']);
    Assert.isFunction(adapter._handlers['loader']);
    Assert.isFunction(adapter._handlers['call']);
    Assert.isUndefined(adapter._handlers['unkownEvent']);
  },

  test_Unknown_Raw_Event_Handler: function() {
    var Assert = YAHOO.util.Assert;
    var adapter = Jitsi.AppletAdapter.extend();
    var connection = Jitsi.Connection.extend({appletAdapter: adapter});
    Assert.isUndefined(adapter._handlers['unkownEvent']);
  }

}));