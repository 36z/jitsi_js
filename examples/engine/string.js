/*globals Jitsi */

/**
  Returns the string repeated the specified number of times.

  @param {Number} n The number of times to repeat this string.
  @param {String} [separator] The separator to put between each iteration of the string.
  @returns {String} The string repeated n times.
  @example
    alert("Stop hittin' yourself. ".repeat(50));
 */
String.prototype.repeat = function (n, sep) {
    sep = sep || '';
    return n < 1 ? '': (new Array(n)).join(this + sep) + this;
};

/**
  Formatter for `String`s.

  Don't call this function- It's here for `Jitsi.format`
  to take care of buisiness for you.

  @param {String} spec The specifier string.
  @returns {String} The string formatted using the format specifier.
 */
String.prototype.toFormat = function (spec) {
  var match = spec.match(Jitsi.FORMAT_SPECIFIER),
      align = match[1],
      fill = match[2] || ' ',
      minWidth = match[6] || 0,
      maxWidth = match[7] || null, len, before, after, value,
      length = this.length;

  if (align) {
    align = align.slice(-1);
  }

  len = Math.max(minWidth, length);
  before = len - length;
  after = 0;

  switch (align) {
  case '<':
    after = before;
    before = 0;
    break;
  case '^':
    after = Math.ceil(before / 2);
    before = Math.floor(before / 2);
    break;
  }

  value = this;
  if (maxWidth != null) {
    maxWidth = +maxWidth.slice(1);
    value = isNaN(maxWidth) ? value : value.slice(0, maxWidth);
  }

  return fill.repeat(before) + value + fill.repeat(after);
};
