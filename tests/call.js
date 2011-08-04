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
    this.data = {
      "package":"call",
      "type":"outgoing-call",
      "call-id":"12345",
      "details":
      {
        "call":
        {
          "state":"initializing",
          "id":"13107594568151244482013",
          "peer-count":"1"
        },
        "peers":
        [
          {
            "id":"131075945622724727271",
            "duration":"0",
            "address":"17329282288@junctionnetworks.com",
            "state":"Initiating Call",
            "is-mute":"false",
            "codec":""
          }
        ]
      }
    };

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
   * registered for package events from
   * the applet.
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
    };

    this.conn.Call.registerHandler('onCallEvent', handler);

    this.applet.fireEvent('packages', this.data);
    Assert.isTrue(handlerFired, 'handler did not fire');

    this.conn.Call.unregisterHandler('onCallEvent');

    handlerFired = false;
    this.applet.fireEvent('packages', this.data);
    Assert.isFalse(handlerFired, 'handler should not fire');

  },

  /**
   * When a call event is fired, it ought
   * to have some utility functions
   * on the object to ease the
   * management of phone calls
   */
  testCallEventDialogArg: function () {
    var Assert = YAHOO.util.Assert;

    var that = this;
    var handler = function (item) {
      Assert.areEqual(item.data['call-id'], that.data['call-id']);
      Assert.areEqual(item.data.type, that.data.type);
      Assert.areEqual(item.data.details.call, that.data.details.call);
      Assert.isFunction(item.hangup);
      Assert.isFunction(item.hold);
      Assert.isFunction(item.sendTone);
    };

    this.conn.Call.registerHandler('onCallEvent', handler);
    this.applet.fireEvent('packages', this.data);
  }

}));