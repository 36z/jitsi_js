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
    Creates a new object from `this` with the objects passed
    in mixed into the object.

    @param {...} extensions The objects to extend `this` with.
    @returns {Jitsi.Base} The new Object, extended with the given properties.
   */
  extend: (function () {
    var mix,
        callable = "[object Function]",
        toString = Object.prototype.toString,
        slice = Array.prototype.slice;

    /** @ignore */
    mix = function (mixins) {
      return {
        into: function (target) {
          var mixin, key;

          for (var i = 0, len = mixins.length; i < len; i += 1) {
            mixin = mixins[i];
            for (key in mixin) {
              target[key] = mixin[key];
            }

            // Take care of IE clobbering `toString`
            if (mixin && mixin.toString !== Object.prototype.toString) {
              target.toString = mixin.toString;
            }
          }
          return target;
        }
      };
    };

    return function () {
      var F = function () {},
          extension, res;
      F.prototype = this;
      extension = new F();
      res = mix(slice.apply(arguments)).into(extension);
      if (toString.call(this.init) === callable) {
        this.init.apply(res);
      }
      return res;
    };
  }())
  
};

/**
  Alias for `extend`.
  @see {@link Jitsi.Base#extend}
  @param {...} extensions The objects to extend `this` with.
  @returns {Jitsi.Base} The new Object, extended with the given properties.
 */
Jitsi.Base.create = Jitsi.Base.extend;
