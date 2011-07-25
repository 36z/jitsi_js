YAHOO.tool.TestRunner.add(new YAHOO.tool.TestCase(
{
  name: 'Jitsi Applet Adapter Tests',

  testCreateAdapter: function() {
    var Assert = YAHOO.util.Assert;
    var adapter = Jitsi.AppletAdapter.extend();
    Assert.isNotUndefined(adapter);
  },

  testRegisterHandler: function () {
    var Assert = YAHOO.util.Assert;
    var adapter = Jitsi.AppletAdapter.extend();
    adapter.registerHandler('registration', function() {});
    Assert.isFunction(adapter._handlers['registration']);
  },

  testUnregisterHandler: function() {
    var Assert = YAHOO.util.Assert;
    var adapter = Jitsi.AppletAdapter.extend();
    adapter.registerHandler('registration', function() {});
    adapter.unregisterHandler('registration');
    Assert.isUndefined(adapter._handlers['registration']);
  }

}));