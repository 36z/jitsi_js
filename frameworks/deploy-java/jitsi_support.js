(
  function($) {
    /** uses sun's java detection script to verify java plugin support **/

    var init = function() {
      $.browser.jitsi = {};
      $.browser.jitsi.osSupported = osSupported();
      $.browser.jitsi.browserSupported = browserSupported();
      setJavaCapabilities();
      $.browser.jitsi.isSupported = isJitsiSupported();
      return $.browser.jitsi.isSupported;
    };

    var isJitsiSupported = function() {
      var jitsi = $.browser.jitsi;
      return (jitsi.osSupported &&
             jitsi.browserSupported &&
             jitsi.java);
    };

    var osSupported = function() {
      var os = navigator.userAgent;
      var osSupported = false;
      if (os.indexOf("Win") != -1) {
        if (os.indexOf("NT 5.1") != -1){
          osSupported = true;
        } else if(os.indexOf("NT 6.0") != -1) {
          osSupported = true;
        } else if(os.indexOf("NT 6.1") != -1) {
          osSupported = true;
        }
      }
      else if (/Intel Mac OS X 10[.|_]6/.test(os)){
        osSupported = true;
      }
      return osSupported;
    };

    var browserSupported = function() {
      var ua = $.browser;
      var browserSupported = false;
      if (ua.mozilla){
        /** FireFox 4.x+ **/
        browserSupported = (ua.version.slice(0,1) >= 2);
      } else if (ua.msie) {
        /** MSIE 8+ **/
        browserSupported = (ua.version >= 8);
      } else if (ua.safari) {
        /** Chrome **/
        var chrome  = /chrome/.test(navigator.userAgent.toLowerCase());
        if (chrome){
          browserSupported = true;
        }
      }
      return browserSupported;
    };

    var setJavaCapabilities = function(){
      $.browser.jitsi.java = false;
      $.browser.jitsi.requiresUpdate = false;
      $.browser.jitsi.requiresInstall = false;
      if (deployJava.versionCheck("1.6.0+")) {
        $.browser.jitsi.java = true;
      } else {
        if(deployJava.versionCheck("1.4") || deployJava.versionCheck("1.5.0*")) {
          $.browser.jitsi.requiresUpdate = true;
        } else {
          $.browser.jitsi.requiresInstall = true;
        }
      }
      return $.browser.jitsi.java;
    };

    init();

})(jQuery);
