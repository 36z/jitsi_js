/**
 * If we think of the SDK as being layered in this way
 *
 * Jitsi.Applet => Jitsi.Connection => Services (Register, Loader, Call)
 *
 * The layer we're testing here is Services.
 * More specifically, we're testing Call
 *
 */
YAHOO.tool.TestRunner.add(new YAHOO.tool.TestCase(
{
  name: 'Jitsi Service Call Tests',

  setUp: function() {
    this.applet = Jitsi.Test.MockApplet.extend();
    this.conn = Jitsi.Connection.extend({appletAdapter: this.applet});
  },

  tearDown: function() {
    delete this.applet;
    delete this.conn;
  },

  testCreateCallService: function() {
    var Assert = YAHOO.util.Assert;
    Assert.isObject(this.conn.Call,
                   "Jitsi.Service.Call was not created, can't do much");
  },

  testCreate: function() {
    var Assert = YAHOO.util.Assert;
    var service = this.conn.Call;
    Assert.isTrue(service.create('sip'));
  },

  testHangup: function() {
    var Assert = YAHOO.util.Assert;
    var service = this.conn.Call;
    Assert.isTrue(service.hangup());
  },

  testHold: function() {
    var Assert = YAHOO.util.Assert;
    var service = this.conn.Call;
    Assert.isTrue(service.hold(true));
  },

  testSendTone: function() {
    var Assert = YAHOO.util.Assert;
    var service = this.conn.Call;
    Assert.isTrue(service.sendTone('*'));
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
    var handler = function (dialog) {
      handlerFired = true;
      dialog.sendTone('*');
    };

    this.conn.Call.registerHandler('onCallEvent', handler);

    /** test handler fires **/
    var data =
      {
        "package":"call",
        "type":"outgoing-call",
        "details":
        {
          "call":
          {
            "state":"initializing",
            "id":"13107594568151244482013",
            "peer-count":"1"
          },
          "peers":
          [{"id":"131075945622724727271"}]
        }
      };


    this.applet.fireEvent('packages', data);
    Assert.isTrue(handlerFired, 'handler did not fire');

    this.conn.Call.unregisterHandler('onCallEvent');

    handlerFired = false;
    this.applet.fireEvent('packages', data);
    Assert.isFalse(handlerFired, 'handler should not fire');

  }

}));