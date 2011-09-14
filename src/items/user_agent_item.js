
Jitsi.Service.UserAgent.Item = Jitsi.Base.extend({
  service: null,
  data: null,
  unregister: function(){
    this.service.unregister();
  }
});

