/**
 * If we think of the SDK as being layered in this way
 *
 * Jitsi.Applet => Jitsi.Connection => Services (Register, Loader, Call)
 *
 * The layer we're testing here is Services.
 * More specifically, we're testing Loader
 *
 */
YAHOO.tool.TestRunner.add(new YAHOO.tool.TestCase(
{
  name: 'Jitsi Service Loader Tests',

  setUp: function() {
    this.data = {
      "package":"loader",
      "type":"loading",
      "details":
      {
        "progress":"80"
      }
    };
    this.applet = Jitsi.Test.MockApplet.extend();
    this.conn = Jitsi.Connection.extend({appletAdapter: this.applet});
  },

  tearDown: function() {
    delete this.applet;
    delete this.conn;
  },

  testCreateLoaderService: function() {
    var Assert = YAHOO.util.Assert;
    Assert.isObject(this.conn.Loader,
                   "Jitsi.Service.Loader was not created, can't do much");
  },

  /**
   * This unit test verifies two features
   *
   * First, a success verifies that our
   * Jitsi.Connection object has properly
   * registered from 'call' events from the applet.
   *
   * Second, a success verifies that
   * an application using the SDK
   * will receive call events
   */
  testFireOnCallEvent: function () {
    var Assert = YAHOO.util.Assert;

    var handlerFired = false;
    var handler = function (packet) {
       handlerFired = true;
    };

    this.conn.Loader.registerHandler('onLoadEvent', handler);

    this.applet.fireEvent('packages', this.data);
    Assert.isTrue(handlerFired, 'handler did not fire');

    this.conn.Loader.unregisterHandler('onLoadEvent');

    handlerFired = false;
    this.applet.fireEvent('packages', this.data);
    Assert.isFalse(handlerFired, 'handler should not fire');

  },

  testLoadEventItem: function () {
    var Assert = YAHOO.util.Assert;
    var that = this;
    var handler = function (item) {
      Assert.areEqual(item.data.progress, that.data.progress);
      Assert.areEqual(item.data.type, that.data.type);
    };

    this.conn.Loader.registerHandler('onLoadEvent', handler);
    this.applet.fireEvent('packages', this.data);
  }


}));