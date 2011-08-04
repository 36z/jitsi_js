/*globals YAHOO Jitsi */

YAHOO.tool.TestRunner.add(new YAHOO.tool.TestCase(
{
  name: 'Jitsi.Base Tests',

  testExtendingBaseExtendsPrototypes: function () {
    var tmp = Jitsi.Base.extend();
    assert.isObject(tmp);
    assert.isFunction(tmp.extend);
    assert.areNotSame(tmp, Jitsi.Base);

    var tmp2 = tmp.extend({foo: 'foo'});
    assert.areSame('foo', tmp2.foo);
    assert.isUndefined(tmp.foo);
  },

  testInitShouldBeCalledOnExtensionTime: function () {
    var Base = Jitsi.Base.extend({
      init: function () {
        this.hasBeenCalled = true;
      }
    });

    var base = Base.extend();
    assert.isTrue(!!base.hasBeenCalled,
                  "`init` should be called on extension time");
  },

  testConnection: function () {
    var Assert = YAHOO.util.Assert;
    var connection = Jitsi.Connection.extend();
    Assert.isNotUndefined(connection);
  },

  testExtend: function () {
    var Assert = YAHOO.util.Assert;

    var tmp = Jitsi.Base.extend();
    Assert.isObject(tmp);
    Assert.isFunction(tmp.extend);
    Assert.areNotSame(tmp, Jitsi.Base);

    var tmp2 = tmp.extend({foo: 'foo'});
    Assert.areSame('foo', tmp2.foo);
    Assert.isUndefined(tmp.foo);
  },

  testMixin: function () {
    var Assert = YAHOO.util.Assert;

    var tmp = Jitsi.Base.extend();
    tmp.mixin({foo: 'foo'});
    Assert.areSame('foo', tmp.foo);
  },

  testMixinAround: function () {
    var Assert = YAHOO.util.Assert;

    var orig = Jitsi.Base.extend({
      doStuff: function () {
        return 'a';
      }
    });

    var secondary = orig.extend({
      doStuff: Jitsi.Function.around(
        function ($orig) {
          return $orig.call(this) + 'b';
        })
    });

    var tertiary = secondary.extend({
      doStuff: Jitsi.Function.around(
        function ($orig) {
          return $orig.call(this) + 'c';
        })
    });

    var quartenary = secondary.extend({
      doStuff: function () {
        return arguments.length;
      }
    });

    // test orig is the same
    Assert.areSame('a', orig.doStuff(), "orig doStuff should return 1 'a'");

    // test order after inital around
    Assert.areSame('ab', secondary.doStuff(), "secondary doStuff should return 'ab'");

    // test around after an around
    Assert.areSame('abc', tertiary.doStuff(), "tertiary doStuff should return 'abc'");

    // test overloading w/o around after around
    Assert.areSame(0, quartenary.doStuff(), "quartenary doStuff should return 0");
  },

  testMixinInferior: function() {
    var Assert = YAHOO.util.Assert;

    var fn1 = function() {
       return 1; },
      fn2 = function() {
         return 2; };

    var obj = Jitsi.Base.extend({ func: fn1 }, { func: fn2 });
    Assert.areSame(2, obj.func(), 'umm... there are big problems since this is just a sanity check');

    var obj2 = Jitsi.Base.extend({ func: fn1 }, { func: Jitsi.Function.inferior(fn2) });
    Assert.areSame(1, obj2.func(), 'we should be running fn1');
  }

}));
