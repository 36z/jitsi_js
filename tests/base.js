/*globals YAHOO Jitsi */

YAHOO.tool.TestRunner.add(new YAHOO.tool.TestCase({
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

  testCreateShouldBeAnAliasForExtend: function () {
    assert.areSame(Jitsi.Base.extend, Jitsi.Base.create,
                   "create and extend should be the same");
  },

  testInitShouldBeCalledOnExtensionTime: function () {
    var Base = Jitsi.Base.extend({
      init: function () {
        this.hasBeenCalled = true;
      }
    });

    var base = Base.create();
    assert.isTrue(!!base.hasBeenCalled,
                  "`init` should be called on extension time");
  }

}));
