/**
 * If we think of the SDK as being layered in this way
 *
 * Jitsi.Applet => Jitsi.Connection => Services (Register, Loader, Call)                                              *
 * The layer we're testing here is Services.
 * More specifically, we're testing Register
 *
 */
YAHOO.tool.TestRunner.add(new YAHOO.tool.TestCase(
{
  name: 'Jitsi Service Register Tests',

  setUp: function() {
    this.applet = Jitsi.Test.MockApplet.extend();
    this.conn = Jitsi.Connection.extend({appletAdapter: this.applet});
  },

  tearDown: function() {
    delete this.applet;
    delete this.conn;
  },

  testCreateRegisterService: function() {
    var Assert = YAHOO.util.Assert;
    Assert.isObject(this.conn.Register,
                   "Jitsi.Service.Register was not created, can't do much");
  },

  testRegister: function() {
    var Assert = YAHOO.util.Assert;
    var service = this.conn.Register;
    Assert.isTrue(service.register('','','',''));
  },

  testUnregister: function() {
    var Assert = YAHOO.util.Assert;
    var service = this.conn.Register;
    Assert.isTrue(service.unregister());
  },

  /**
   * This unit test verifies two features
   *
   * First, a success verifies that our
   * Jitsi.Connection object has properly
   * registered from 'registration' events from the applet
   *
   * Second, a success verifies that
   * an application using the SDK
   * will receive registration events
   */
  testFireOnRegisterEvent: function () {
    var Assert = YAHOO.util.Assert;

    var handlerFired = false;
    var handler = function (userAgent) {
      handlerFired = true;
      Assert.areEqual(userAgent.type,"registered");
    };

    this.conn.Register.registerHandler('onRegisterEvent', handler);

    var myJson = {
      "package":"registration",
      "type":"registered",
      "details":""
    };

    this.applet.fireEvent('packages', myJson);
    Assert.isTrue(handlerFired, 'handler did not fire');

    this.conn.Register.unregisterHandler('onRegisterEvent');

    handlerFired = false;
    this.applet.fireEvent('packages', myJson);
    Assert.isFalse(handlerFired, 'handler should not fire');
  }

}));