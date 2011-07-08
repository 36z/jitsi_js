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
  }

}));
