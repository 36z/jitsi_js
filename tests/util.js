/*global YAHOO*/
Jitsi.Test.Util = new YAHOO.tool.TestCase({
  name: 'Jitsi.Util Tests',

  testAround: function () {
    var Assert = YAHOO.util.Assert;
    Assert.isFunction(Jitsi.Function.around);
    Assert.isTrue(Jitsi.Function.around(function () {})._jtAround);
  },

  testInferior: function () {
    var Assert = YAHOO.util.Assert;
    Assert.isFunction(Jitsi.Function.inferior);
    Assert.isTrue(Jitsi.Function.inferior(function () {})._jtInferior);
  },

  testCurry: function () {
    var Assert = YAHOO.util.Assert;
    Assert.isFunction(Function.prototype.curry);
    var aggregate = function () {
      var sum = 0, idx = arguments.length;
      while (idx--) {
        sum += arguments[idx];
      }
      return sum;
    };
    Assert.isFunction(aggregate.curry(1));
    Assert.areSame(aggregate.curry(1)(), aggregate(1));
    Assert.areSame(aggregate.curry(1).curry(2)(), aggregate(1, 2));
  },

  testBind: function () {
    var Assert = YAHOO.util.Assert;
    var Person = Jitsi.Base.extend({
      name: null,
      sayHi: function () {
        return this.greet('', "Hello");
      },

      greet: function (adjective, greeting) {
        return adjective + greeting + ', ' + this.name;
      }
    });

    var mal = Person.extend({name: 'Mal'});
    var mrFancyPants = Person.extend({name: 'Mr. Fancy Pants'});
    Assert.isFunction(Function.prototype.bind);
    Assert.isFunction(mal.sayHi.bind(mrFancyPants));
    Assert.areSame(mal.sayHi.bind(mrFancyPants)(), "Hello, " + mrFancyPants.name);

    var mornin = mal.greet.bind(mrFancyPants, 'Good ');
    Assert.isFunction(mornin);
    Assert.areSame(mornin('Morning'), 'Good Morning, ' + mrFancyPants.name);
  },

  testArrayFrom: function () {
    var Assert = YAHOO.util.Assert;
    Assert.isFunction(Array.from);
    var arrayLike = {
      '0': 1,
      '1': 0,
      length: 2
    };
    Assert.isArray(Array.from(arrayLike));
    Assert.areSame(Array.from(arrayLike).length, arrayLike.length);
    Assert.areSame(Array.from(arrayLike)[0], arrayLike[0]);
    Assert.areSame(Array.from(arrayLike)[1], arrayLike[1]);
  },

  testIndexOf: function () {
    var Assert = YAHOO.util.Assert;
    Assert.isFunction(String.prototype.indexOf);
    Assert.areSame("hello".indexOf("l"), 2);
    Assert.areSame("hello".indexOf("o"), 4);
    Assert.areSame("hello".indexOf("z"), -1);
    Assert.areSame("bananas".indexOf("anas"), 3);

    Assert.areSame("bananas".indexOf("ana"), 1); // prereq
    Assert.areSame("bananas".indexOf("ana",2), 3); // test start param
  }

});

YAHOO.tool.TestRunner.add(Jitsi.Test.Util);
