Array.prototype.toFormat = function (spec) {
  var buffer = [];
  for (var i = 0, len = this.length; i < len; i++) {
    buffer[i] = Jitsi.format(spec, this[i]);
  }
  return buffer.join('');
};
