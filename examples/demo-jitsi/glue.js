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

DemoApp.Jitsi = Jitsi.Base.extend({

  /**
  doRegister: function (aForm) {
    $('err').html('');

    var jid  = aForm.username.value,
        pass = aForm.password.value;
    //this.bosh.connect(jid, pass, handleStatusChanged);
  },

  doUnregister: function () {
    $('#logged_out_pane').show();
    $('#logged_in_pane').hide();
  }
  **/

});

DemoApp.Jitsi = Jitsi.Base.extend(
{
  applet: Jitsi.Connection.extend({
    appletAdapter: Jitsi.Applet.extend({
      appletID: "jitsi-app"
    })
  }),

  init: Jitsi.Function.around(
    function () {
      this.applet.Loader.registerHandler('onLoadEvent',
                                         this._handleLoadEvents);
      this.applet.Register.registerHandler('onRegisterEvent',
                                           this._handleRegisterEvents);
      this.applet.Call.registerHandler('onCallEvent',
                                       this._handleCallEvents);
    }
  ),

  _handleLoadEvents: function (evt) {

  },

  _handleCallEvents: function (dialog) {
    console.log("CallDialog " + dialog);
    var el = $('.jitsi .create .output');
    if (el && el.length && el.length > 0) {
      el.html("");
    }
  },

  _handleRegisterEvents: function(userAgent) {
    console.log("UserAgent " + userAgent);
    var el = $('.jitsi .pickup .output ');
    if (el && el.length && el.length > 0) {
      el.html("");
    }
  },

  register: function (formID) {
    var username = _getFormValue(formID, 'username'),
        authUsername = _getFormValue(formID, 'auth-username'),
        passwd  = _getFormValue(formID, 'password');

    this.applet.Register.register(username, 'oren',
                                 authUsername, passwd);
    return false;
  },

  createCall: function (formID) {
    var to = _getFormValue(formID, 'to');
    this.applet.Call.create(to);
    return false;
  },

  hangup: function() {
    this.applet.Call.hangup();
  }

});

$(document).ready(function ()
{

  $('#register').bind('submit', function (e) {
    e.preventDefault();
    DemoApp.Jitsi.register(this.id);
  });

  $('#create-call').bind('submit', function (e) {
    e.preventDefault();
    DemoApp.Jitsi.createCall(this.id);
  });

  $('#hangup-call').bind('submit', function (e) {
    e.preventDefault();
    DemoApp.Jitsi.hangup();
  });

});

var onerror = function (e) {
  return false;
};
