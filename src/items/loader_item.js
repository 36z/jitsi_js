
Jitsi.Service.Loader.Item = Jitsi.Base.extend({
  service: null,

  data: null,

  progress: null,

  type: null,

  init: function(){
    if (this.data){
      this.progress = this.data.details.progress;
      this.progress = isNaN(this.progress) ? 0: this.progress;
      this.type = this.data.type;
    }
  }
});
