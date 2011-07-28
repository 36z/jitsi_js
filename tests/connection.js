/**
 * If we think of the SDK as being layered in this way
 *
 * Jitsi.Applet => Jitsi.Connection => Services (Register, Loader, Call)
 *
 * The layer we're testing Jitsi.MockApplet
 * which replaces Jitsi.Applet
 */
YAHOO.tool.TestRunner.add(new YAHOO.tool.TestCase(
{
  name: 'Jitsi Connection Tests',

  setUp: function() {
    this.applet = Jitsi.Test.MockApplet.extend();
  },

  tearDown: function() {
    delete this.applet;
  },

  /**
   * Spot check MockApplet
   * If this test fails, all
   * other test will follow suit
   */
  testSpotCheckMockApplet: function() {
    var Assert = YAHOO.util.Assert;
    Assert.isObject(this.applet,
                    "the mock applet is not defined, can't do much");
    /**
     * Make sure the necessary functions exist
     * in order to execute the tests
     */
    Assert.isFunction(this.applet.registerHandler);
    Assert.isFunction(this.applet.unregisterHandler);
    Assert.isFunction(this.applet.fireEvent);

    var handlerFired = false;
    var handler = function (packet) {
       handlerFired = true;
    };

    this.applet.registerHandler('call', handler);

    var myJson = {
      "package":"call",
      "type":"outgoing-call",
      "details":""
    };

    this.applet.fireEvent('call', myJson);
    Assert.isTrue(handlerFired, 'handler did not fire');

    this.applet.unregisterHandler('call');

    handlerFired = false;
    this.applet.fireEvent('call', myJson);
    Assert.isFalse(handlerFired, 'handler should not fire');
  },

  /**
   * Test for a valid connection object.
   * Spot check for existing functions
   */
  testCreateConnection: function() {
    var Assert = YAHOO.util.Assert;
    var conn = Jitsi.Connection.extend({appletAdapter: this.applet});
    Assert.isNotUndefined(conn);
    /**
     * sends api calls into the applet
     **/
    Assert.isFunction(conn.sendEvent,
                          "can't call the the applet api");

    /**
     * Services will use this
     * function to receive callback events
     */
    Assert.isFunction(conn.registerEventHandler,
                         "services can't register to receive events");

    Assert.isFunction(conn.unregisterEventHandler,
                         "can't unregister events");
  },

  /**
   * With a valid appletAdapter
   * the Jitsi.Connection object
   * should register for three event
   * packages ('call, 'registration', 'loader')
   * We can't test that these packages were
   * registered directly through the Jitsi.Connection
   * Object, but we can test that the Services
   * were created. When we test the services layer
   * we can verify that events were registered properly
   */
  testServicesWereCreated: function() {
    var Assert = YAHOO.util.Assert;
    var conn = Jitsi.Connection.extend({appletAdapter: this.applet});
    Assert.isObject(conn.Loader,
                    "serivce Jitsi.Service.Loader was not initialized");
    Assert.isObject(conn.Register,
                    "serivce Jitsi.Service.Register was not initialized");
    Assert.isObject(conn.Call,
                    "serivce Jitsi.Service.Call was not initialized");
  },

  /**
   * Without a valid appletAdapter, Services
   * do not get initialized
   */
  testServicesWereNotCreated: function() {
    var Assert = YAHOO.util.Assert;
    var conn = Jitsi.Connection.extend();
    Assert.isUndefined(conn.Loader,
                    "serivce Jitsi.Service.Loader should not initialized");
    Assert.isUndefined(conn.Register,
                    "serivce Jitsi.Service.Register should not initialized");
    Assert.isUndefined(conn.Call,
                    "serivce Jitsi.Service.Call should not initialized");
  }

}));