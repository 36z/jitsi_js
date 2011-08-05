/**
 *  Introduction:
 *  -------------
 *  glue.js is a sample application that spotlights OXJS,
 *  the JavaScript SDK developed by Junction Networks.
 *
 *  OX was implemented for the purpose of abstracting the
 *  low level XMPP messaging used for real-time events.
 *  In this light, developers could focus entirely on the
 *  business requirements of their application.
 *
 *  Use OXJS if you need to build a web application that
 *  features real-time call events. Use the sample code in
 *  glue.js to guide you in your development using OX against
 *  Junction's XMPP based API.
 *
 *  glue.js will illustrate how to :
 *
 *    - Make SIP calls
 *    - Retrieve notifications of call states
 *      (eg. Whether the call was answered, terminated, etc.)
 *    - Manage your Roster
 *
 *
 *  Getting Started:
 *  ----------------
 *  In order to work around Same Origin Policy issues, add the following
 *  snippet to your Apache config file:
 *
 *      SSLProxyEngine on
 *      ProxyPass /http-bind https://my.onsip.com/http-bind
 *      ProxyPassReverse /http-bind http://my.onsip.com/http-bind
 *
 *  To run this Demo application you'll need to point your root web
 *  folder to the root directory of your OXJS download.
 *  For instance :
 *      http://localhost/OXJS/examples/demo-strophe/index.html
 *  You can access API documentation via
 *      http://localhost/OXJS/doc/public/index.html
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

function handleStatusChanged(status) {
    console.debug('Status changed: ' + status);
}

function keepAlive() {
  console.debug('Keep Alive');
}

function killBlock() {
  console.debug('kill block');

}

DemoApp.Jitsi = Jitsi.Base.extend(
{
  applet: Jitsi.Connection.extend({
    appletAdapter: Jitsi.Applet.extend({
      appletID: "jitsi-app"
    })
  }),

  init: Jitsi.Function.around(
    function () {
      this.applet.Call.registerHandler('onCallEvent',
                                       this._handleCallEvents);
      this.applet.Loader.registerHandler('onLoadEvent',
                                         this._handleLoadEvents);
      this.applet.Register.registerHandler('onRegisterEvent',
                                           this._handleRegisterEvents);
    }
  ),

  _handleCallEvents: function (callItem) {
    var l = "";
    if (callItem.data && callItem.data.details){
      var type = callItem.data.type;
      l = JSON.stringify(callItem.data);
      l = "Received Call Event: " + type + " - " + l;
      logMessage(l,false);
    }
  },

  _handleRegisterEvents: function(uaItem) {
    var username, l;
    if (uaItem) {
      if (uaItem.data.type){
        if (uaItem.data.type == 'registered') {
          $('#logged_out_pane').hide();
          $('#logged_in_pane').show();
          username = _getFormValue('register', 'username');
          $('#logged_in_as').html(username);
        } else if (uaItem.data.type == 'unregistered') {
          $('#logged_out_pane').show();
          $('#logged_in_pane').hide();
          $('#logged_in_as').html("");
        }
        l = JSON.stringify(uaItem.data);
        l = "Recieved Register Event: " + uaItem.data.type + " - " + l;
        logMessage(l,false);
      }
    }
  },

  _handleLoadEvents: function (loadItem) {
    var msg = "";
    if (loadItem) {
      if (loadItem.type) {
        if (loadItem.data && loadItem.data.details) {
          msg = loadItem.data.details.message;
        }
        $("#loading").html("Applet State: " + loadItem.type +
                           ", Progress: " + loadItem.progress +
                           ", status: " + msg);
      }
    }
  },

  register: function (formID) {
    var username = _getFormValue(formID, 'username'),
        authUsername = _getFormValue(formID, 'auth-username'),
        passwd  = _getFormValue(formID, 'password');

    var displayName = "test";
    if (username && username.length)
    {
      var idx = username.indexOf('@');
      if (idx != -1){
        displayName = username.substr(0, idx);
      }
    }

    return this.applet.Register.register(username, displayName,
                                         authUsername, passwd);
  },

  unregister: function(formID) {
    this.applet.Register.unregister();
  },

  createCall: function (formID) {
    var to = _getFormValue(formID, 'to');
    return this.applet.Call.create(to);
  },

  answerCall: function(formID) {
    return this.applet.Call.answer();
  },

  hangup: function(formID) {
    return this.applet.Call.hangup();
  }

});

$(document).ready(function ()
{
  $('#register').bind('submit', function (e) {
    e.preventDefault();
    logMessage('sendEvent: register',true);
    DemoApp.Jitsi.register(this.id);
  });

  $('#unregister').bind('submit', function (e) {
    e.preventDefault();
    logMessage('SendEvent: unregister',true);
    DemoApp.Jitsi.unregister(this.id);
  });

  $('#create-call').bind('submit', function (e) {
    e.preventDefault();
    logMessage('sendEvent: create',true);
    DemoApp.Jitsi.createCall(this.id);
  });

  $('#pickup-call').bind('submit', function(e) {
    e.preventDefault();
    logMessage('sendEvent: answer',true);
    DemoApp.Jitsi.answerCall(this.id);
  });

  $('#hangup-call').bind('submit', function (e) {
    e.preventDefault();
    logMessage('sendEvent: hangup',true);
    DemoApp.Jitsi.hangup(this.id);
  });

});

var onerror = function (e) {
  return false;
};
