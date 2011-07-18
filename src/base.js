/* global Jitsi */

/** @class
  The base object that provides a mechanism for simple inheritance
  based off of Douglas Crockford's [prototypal inheritance][1].

  Using `extend`, {@link Jitsi.Base} provides a simple way to
  extend any object to create a new one. This allows for simple
  mutations to full fledged extensions.

  If `init` is defined on the object, it will be called at
  extension time.

     [1]: http://javascript.crockford.com/prototypal.html

  @example
    var Bird = Jitsi.Base.extend({
      canFly: true
    });

    var Person = Jitsi.Base.extend({
      name: "nil"
    });

    var BirdMan = Person.extend(Bird, { name: 'Harvey Birdman' });
    alert(BirdMan.name);
    // => "Harvey Birdman"

    alert(BirdMan.canFly);
    // => true
 */
Jitsi.Base = {

  /**
   * Iterates over all arguments, adding their own properties to the
   * receiver.
   *
   * @example
   *   obj.mixin({
   *     hello: "world"
   *   });
   *   obj.hello;
   *   // -> "world"
   *
   * @returns {Jitsi.Base} the receiver
   *
   * @see Jitsi.Base.extend
   */
  mixin: function () {
    var len = arguments.length,
      /** @ignore */
      empty = function () {},
      obj, val, fn, cur;

    for (var i = 0; i < len; i++) {
      obj = arguments[i];
      for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          val = obj[prop];
          cur = this[prop];

          if (Jitsi.isFunction(val) && val._xcInferior && cur) {
            continue;
          }

          if (Jitsi.isFunction(val) && val._xcAround) {
            fn = (cur && Jitsi.isFunction(cur)) ? cur : empty;
            val = val.curry(fn);
          }


          this[prop] = val;
        }
      }

      // Prevents IE from clobbering toString
      if (obj && obj.toString !== Object.prototype.toString) {
        this.toString = obj.toString;
      }
    }
    return this;
  },

  /**
   * Creates a new object which extends the current object.  Any
   * arguments are mixed in to the new object as if {@link Jitsi.Base.mixin}
   * was called on the new object with remaining args.
   *
   * @example
   *   var obj = Jitsi.Base.extend({
   *     hello: "world"
   *   });
   *   obj.hello;
   *   // -> "world"
   *
   *   Jitsi.Base.hello;
   *   // -> undefined
   * @returns {Jitsi.Base} the new object
   *
   * @see Jitsi.Base.mixin
   */
  extend: function () {
    var F = function () {},
        rc;
    F.prototype = this;
    rc = new F();
    rc.mixin.apply(rc, arguments);

    if (rc.init && rc.init.constructor === Function) {
      rc.init.call(rc);
    }

    return rc;
  }

};
