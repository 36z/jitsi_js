Jitsi.Test = {};

// globally scope assert to make testing easier to read.
var assert = YAHOO.util.Assert;

/**
  Assertion for when a function is expected to raise an event.

  @param {Error} err The error type that is expected to be raised.
  @param {Function} fn The function that is expected to raise an error.
  @param {Object} scope The scope to apply to the function
  @param {...} [arguments] The arguments to provide to the lambda.
 */
YAHOO.util.Assert.raises = function (err, fn, scope) {
  var args = Array.prototype.slice(arguments).slice(3),
      caught = false;

  try {
    fn.apply(scope, args);
  } catch (x) {
    caught = true;
    if (!(x instanceof err)) {
      this.fail("Expected " + fn.toString() + " to throw " + err + ".");
    }
  }

  if (!caught) {
    this.fail("Expected " + fn.toString() + " to throw " + err + ".");
  }
};



