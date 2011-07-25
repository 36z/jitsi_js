YAHOO.tool.TestRunner.add(new YAHOO.tool.TestCase(
{
  name: 'Jitsi Applet Adapter Tests',

  test_Create_Adapter: function() {
    var Assert = YAHOO.util.Assert;
    var adapter = Jitsi.AppletAdapter.extend();
    Assert.isNotUndefined(adapter);
  },

  test_Register_Handler: function () {
    var Assert = YAHOO.util.Assert;
    var adapter = Jitsi.AppletAdapter.extend();
    adapter.registerHandler('registration', function() {});
    Assert.isFunction(adapter._handlers['registration']);
  },

  test_Unregister_Handler: function() {
    var Assert = YAHOO.util.Assert;
    var adapter = Jitsi.AppletAdapter.extend();
    adapter.registerHandler('registration', function() {});
    adapter.unregisterHandler('registration');
    Assert.isUndefined(adapter._handlers['registration']);
  }

}));