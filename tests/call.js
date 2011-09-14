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
      "type":"confirmed",
      "callId":"12345",
      "details":
      {
        "call":
        {
          "state":"initializing",
          "id":"13107594568151244482013",
          "count":"1"
        },
        "peers":
        [
          {
            "id":"131075945622724727271",
            "duration":"0",
            "address":"17329282288@junctionnetworks.com",
            "state":"Initiating Call",
            "mute":"false",
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
    var userId = 'test@example.onsip.com';
    var to = '7777';
    var setupId = 'id-1-2-3';
    Assert.isTrue(service.create(userId,to,setupId));
  },

  testHangup: function() {
    var Assert = YAHOO.util.Assert;
    var service = this.conn.Call;
    var callId = '234234';
    Assert.isTrue(service.hangup(callId));
  },

  testHold: function() {
    var Assert = YAHOO.util.Assert;
    var service = this.conn.Call;
    var callId = '293929392';
    var hold = true;
    Assert.isTrue(service.hold(hold,callId));
  },

  testSendTone: function() {
    var Assert = YAHOO.util.Assert;
    var service = this.conn.Call;
    var callId = '2923992949394';
    var key = '0';
    Assert.isTrue(service.sendTone(callId, key));
  },

  testSendToneMissingCallId: function() {
    var Assert = YAHOO.util.Assert;
    var service = this.conn.Call;
    var key = '0';
    Assert.isFalse(service.sendTone(key));
  },

  testSendToneMissingKey: function() {
    var Assert = YAHOO.util.Assert;
    var service = this.conn.Call;
    var callId = 'b234234324';
    Assert.isFalse(service.sendTone('*'));
  },

  testAnswer: function() {
    var Assert = YAHOO.util.Assert;
    var service = this.conn.Call;
    var callId = '234234';
    Assert.isTrue(service.answer(callId));
  },

  testMute: function() {
    var Assert = YAHOO.util.Assert;
    var service = this.conn.Call;
    var callId = '1234';
    var mute = false;
    Assert.isTrue(service.mute(mute,callId));
  },

  testMuteMissingCallId: function() {
    var Assert = YAHOO.util.Assert;
    var service = this.conn.Call;
    var mute = false;
    Assert.isFalse(service.mute(mute));
  },

  testTransfer: function() {
    var Assert = YAHOO.util.Assert;
    var service = this.conn.Call;
    var callId = '1234';
    var peerId = '5678';
    var targetUri = '7777';
    Assert.isTrue(service.transfer(callId, peerId, targetUri));
  },

  testTransferMissingParameter: function() {
    var Assert = YAHOO.util.Assert;
    var service = this.conn.Call;
    var peerId = '5678';
    var targetUri = '7777';
    Assert.isFalse(service.transfer(peerId, targetUri));
  },

  testInviteCalleeToCall: function() {
    var Assert = YAHOO.util.Assert;
    var service = this.conn.Call;
    var callId = '1234';
    var targetUri = '7777';
    Assert.isTrue(service.inviteCalleeToCall(callId, targetUri));
  },

  testMissingTargetUri: function() {
    var Assert = YAHOO.util.Assert;
    var service = this.conn.Call;
    var callId = '1234';
    Assert.isFalse(service.inviteCalleeToCall(callId));
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
  testCallEventItem: function () {
    var Assert = YAHOO.util.Assert;

    var that = this;
    var handler = function (item) {
      Assert.areEqual(item.data['callId'], that.data['callId']);
      Assert.areEqual(item.data.type, that.data.type);
      Assert.areEqual(item.data.details.call, that.data.details.call);
      Assert.isFunction(item.hangup);
      Assert.isFunction(item.hold);
      Assert.isFunction(item.sendTone);
      Assert.isFunction(item.mute);
      Assert.isFunction(item.answer);
      Assert.isFunction(item.transfer);
      Assert.isFunction(item.inviteCalleeToCall);
    };

    this.conn.Call.registerHandler('onCallEvent', handler);
    this.applet.fireEvent('packages', this.data);
  }

}));