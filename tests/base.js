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
    console.log(connection);
    Assert.isNotUndefined(connection);
    console.log(connection.init);

  }
}));
