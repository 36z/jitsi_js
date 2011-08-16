/**
 *  Introduction:
 *  -------------
 *  glue.js is a sample application that spotlights
 *  Junction Networks Javascript SDK for interfacing
 *  with the Jitsi Applet SIP Phone.
 *
 *  glue.js will illustrate how to :
 *
 *    - Make SIP calls
 *
 *  Getting Started:
 *  ----------------
 *
 */

/* globals DemoApp Jitsi $ */
DemoApp = {};

function htmlEnc(str) {
  return str.split(/&/).join("&amp;")
            .split(/;/).join("&semi;")
            .split(/</).join("&lt;")
            .split(/>/).join("&gt;");
}

function logMessage(xml, outbound) {
  var sent = (!!outbound) ? 'outbound' : 'inbound',
      msg  = "<div class='msg %s'>" + htmlEnc(xml) + "</div>";
  if (window.console && window.console.debug) {
    console.debug('(' + sent + ') - ' + xml);
  }
  msg = msg.replace(/%s/, sent);
  $('#message_pane_inner').append(msg);
  $('#message_pane_inner :last').get(0).scrollIntoView();
}

function _getFormValue(formID, inputName) {
  return $('form#' + formID + ' input[name=' + inputName + ']').val();
}

function _addOutput(selector, msg) {
  $(selector).append("<li>" + msg + "</li>");
}

function _generateHangupTemplate(id){
  var divEl = "" +
    "<div id=\"hang-up-" + id + "\" class=\"hangup-tmpl\">" +
      "<h4>Hangup Call (callId " + id + ")</h4>" +
      "<div>" +
        "<form id=\"hangup-call-" + id + "\" action=\"#\">" +
          "<table>" +
            "<tr>" +
              "<td><input type=\"button\" id=\"hold-" + id+ "\" value=\"hold\"/></td>" +
              "<td><input type=\"submit\" value=\"hangup\"/></td>" +
            "</tr>" +
          "</table>" +
        "</form>" +
      "</div>" +
    "</div>";

  return divEl;
}

function _generatePickupTemplate(id){
  var divEl = "" +
    "<div id=\"pick-up-" + id + "\" class=\"pickup-tmpl\">" +
      "<h4>Pickup Call (callId " + id + ")</h4>" +
      "<div>" +
        "<form id=\"pickup-call-" + id + "\" action=\"#\">" +
          "<table>" +
            "<tr>" +
              "<td><input type=\"button\" id=\"busy-" + id + "\" value=\"busy\"/></td>" +
              "<td><input type=\"submit\" value=\"pickup\"/></td>" +
            "</tr>" +
          "</table>" +
        "</form>" +
      "</div>" +
    "</div>";
  return divEl;
}

function loadApplet(codebase) {
  DemoApp.Jitsi = DemoApp.Jitsi.extend({
    applet: Jitsi.Connection.extend({
      appletAdapter: Jitsi.Applet.extend({
        codebase: codebase,
        appletID: "jitsi-app"
      })
    }),

    init: Jitsi.Function.around(function () {
      this.applet.Call.registerHandler('onCallEvent',
                                       this._handleCallEvents);
      this.applet.Loader.registerHandler('onLoadEvent',
                                         this._handleLoadEvents);
      this.applet.UserAgent.registerHandler('onRegisterEvent',
                                           this._handleRegisterEvents);
    })
  });

  $('#register').bind('submit', function (e) {
    e.preventDefault();
    logMessage('sendEvent: register', true);
    DemoApp.Jitsi.register(this.id);
  });

  $('#unregister').bind('submit', function (e) {
    e.preventDefault();
    logMessage('SendEvent: unregister', true);
    DemoApp.Jitsi.unregister(this.id);
  });

  $('#create-call').bind('submit', function (e) {
    e.preventDefault();
    logMessage('sendEvent: create', true);
    DemoApp.Jitsi.createCall(this.id);
  });
}

DemoApp.Jitsi = Jitsi.Base.extend({

  _handleHold: function(callItem, hold) {
    var callId = callItem.callId;
    if (!callId || (callId.toString().length === 0)){
      Jitsi.error("callId was invalid in _handleHold, failing");
    }

    if (hold){
      if (hold.local){
        $('#hold-' + callItem.callId).val('unhold');
        $('#hold-' + callItem.callId).unbind('click');
        $('#hold-' + callItem.callId).bind('click', {item:callItem}, function(e) {
          e.preventDefault();
          logMessage('sendEvent: unhold', true);
          e.data.item.hold(false);
        });
      } else {
        $('#hold-' + callItem.callId).val('hold');
        $('#hold-' + callItem.callId).unbind('click');
        $('#hold-' + callItem.callId).bind('click', {item:callItem}, function(e) {
          e.preventDefault();
          logMessage('sendEvent: hold', true);
          e.data.item.hold(true);
        });
      }
    }
  },

  _getHoldObj : function(callItem) {
    var peer;
    var peers = callItem.data.details.peers;
    if (peers.length > 0){
      peer = peers[0];
      return peer.hold;
    }
    return null;
  },

  _insertHangup: function(callItem) {
    var callId = callItem.callId;
    var hangupBtn = $('#hangup-call-' + callId);
    if (!hangupBtn.html()){
      injectHangupEl = _generateHangupTemplate(callId);
      $("#hangup-container").append(injectHangupEl);

      (function(item) {
        $('#hangup-call-' + item.callId).bind('submit',{item:item},function(e) {
          e.preventDefault();
          logMessage('sendEvent: hangup', true);
          e.data.item.hangup();
        });
      }(callItem));
    }
  },

  _handleCreated: function(callItem) {
    DemoApp.Jitsi._insertHangup(callItem);
  },

  _handleConfirmed: function(callItem) {
    var jitsi = DemoApp.Jitsi;
    var callId = callItem.callId;
    var hold;
    if (!callId || (callId.toString().length === 0)){
      Jitsi.error("callId was invalid in _handleConfirmed, failing");
    }
    if ($('#pick-up-' + callId).html()){
      $('#busy-' + callId).unbind('click');
      $('#pickup-call-' + callId).unbind('submit');
      $('#pick-up-' + callId).html("");
    }
    hold = jitsi._getHoldObj(callItem);
    jitsi._insertHangup(callItem);
    jitsi._handleHold(callItem, hold);
  },

  _handleRequested: function(callItem) {
    var callId = callItem.callId;
    if (!callId || (callId.toString().length === 0)){
      Jitsi.error("callId was invalid in _handleRequested, failing");
    }
    var injectPickupEl = _generatePickupTemplate(callId);

    if ($('#pick-up-' + callId).html()){
      return;
    }

    $("#pickup-container").append(injectPickupEl);

    (function(item) {
      $('#pickup-call-' + item.callId).bind('submit', function(e) {
        e.preventDefault();
        logMessage('sendEvent: pickup', true);
        item.answer();
      });
      $('#busy-' + item.callId).bind('click', function(e) {
        e.preventDefault();
        logMessage('sendEvent: busy here', true);
        item.hangup();
      });
    }(callItem));
  },

  _handleTerminated: function(callItem) {
    var callId = callItem.callId;
    if (callId){
      if ($('#hold-' + callId).val()){
        $('#hold-' + callId).unbind('click');
      }
      $('#hangup-call-' + callId).unbind('submit');
      $('#hang-up-' + callId).html('');
      if ($('#pick-up-' + callId).html()){
        $('#pickup-call-' + callId).unbind('submit');
        $('#busy-' + callId).unbind('click');
        $('#pick-up-' + callId).html("");
      }
    }
  },

  _handleCallEvents: function (callItem) {
    if (callItem.data && callItem.data.details){
      var type = callItem.data.type;
      var msg = JSON.stringify(callItem.data);
      msg = "Received Call Event: " + type + " - " + msg;
      logMessage(msg,false);
      if (callItem.data.type == 'confirmed'){
        DemoApp.Jitsi._handleConfirmed(callItem);
      } else if (callItem.data.type == 'terminated'){
        DemoApp.Jitsi._handleTerminated(callItem);
      } else if (callItem.data.type == 'requested'){
        DemoApp.Jitsi._handleRequested(callItem);
      } else if (callItem.data.type == 'created'){
        DemoApp.Jitsi._handleCreated(callItem);
      }
    }
  },

  _handleRegisterEvents: function(uaItem) {
    var username, msg;
    if (uaItem) {
      if (uaItem.data.type){
        if (uaItem.data.type == 'registered') {
          $('#logged_out_pane').hide();
          $('#logged_in_pane').show();
          $('#applet-config').hide();
          username = _getFormValue('register', 'username');
          $('#logged_in_as').html(username);
        } else if (uaItem.data.type == 'unregistered') {
          $('#logged_out_pane').show();
          $('#logged_in_pane').hide();
          $('#logged_in_as').html("");
          $('#applet-config').show();
        }
        msg = JSON.stringify(uaItem.data);
        msg = "Received Register Event: " + uaItem.data.type + " - " + msg;
        logMessage(msg,false);
      }
    }
  },

  _handleLoadEvents: function (loadItem) {
    var msg = "";
    logMessage(JSON.stringify(loadItem.data),false);
    if (loadItem) {
      if (loadItem.type) {
        if (loadItem.data && loadItem.data.details) {
          msg = loadItem.data.details.message;
        }
        $("#load-state").text(loadItem.type);
        $("#load-status-message").text(msg);
        document.getElementById("load-progress").value =
          loadItem.data.details.progress;
      }
    }

    if (loadItem.type == "loaded")
      $("#logged_out_pane").show();
  },

  register: function (formID) {
    var username = _getFormValue(formID, 'username'),
        authUsername = _getFormValue(formID, 'auth-username'),
        passwd  = _getFormValue(formID, 'password');

    var displayName = "test", idx;
    if (username && username.length)
    {
      idx = username.indexOf('@');
      if (idx != -1){
        displayName = username.substr(0, idx);
      }
    }

    return this.applet.UserAgent.register(username, displayName,
                                         authUsername, passwd);
  },

  unregister: function(formID) {
    this.applet.UserAgent.unregister();
  },

  createCall: function (formID) {
    var to = _getFormValue(formID, 'to');
    return this.applet.Call.create(to, 'call-setup-1-2-3');
  }

});

$(document).ready(function() {
  var parsedHash = function(hash) {
    hash = hash.replace(/^(#)/,"");

    var hashParts = hash.split(",");
    var ret = {};
    var tmp;

    for (var i=0;i<hashParts.length;i++) {
      tmp = hashParts[i].split("=");
      ret[tmp[0]] = tmp[1];
    }
    return ret;
  }(location.hash);

  var codebase=parsedHash.codebase || Jitsi.Applet.codebase;
  $('#applet-codebase').val(codebase);

  $('#applet-load').click(function() {
    $("#load-progress").css({visibility: 'visible'});

    var codebase = $('#applet-codebase').val();
    loadApplet(codebase);
  });
});
