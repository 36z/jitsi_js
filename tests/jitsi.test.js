YAHOO.tool.TestRunner.add(new YAHOO.tool.TestCase(
{
  name: 'Jitsi Tests',

  testRegisteredEventHandler: function () {
    var Assert = YAHOO.util.Assert;
    // var connection = Jitsi.Connection.extend();

    //console.log(connection);
    //Assert.isNotUndefined(connection);
    //console.log(connection.init);

    //var loader =
  },

  testAdapterAddRegisterHandler: function() {
    var Assert = YAHOO.util.Assert;
    var adapter = Jitsi.AppletAdapter.extend();
    Assert.isNotUndefined(adapter);
  }

}));