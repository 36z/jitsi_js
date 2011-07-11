/** @class
  DTMF buttons for the dialpad.
  @extends Jitsi.View
 */
Jitsi.DTMFButton = Jitsi.View.extend(
  /** @scope Jitsi.DTMFButton */{

  tagName: 'td',
  template: "{key}<small>{alt}</small>",
  alt: '&nbsp;',

  mouseDown: function () {
    this.$().addClass('focus');
  },

  mouseUp: function () {
    this.$().removeClass('focus');
  }

});

/** @class
  Dialpad popup.
  @extends Jitsi.View
 */
Jitsi.Dialpad = Jitsi.View.extend(
  /** @scope Jitsi.Dialpad */{

  isVisible: false,

  tagName: "div",

  classNames: ["dialpad"],

  template: '<div class="arrow"></div><table>{dtmf:<tr>{{0}}</tr>}</table>',

  dtmf: [[Jitsi.DTMFButton.create({ key: '1' }),
          Jitsi.DTMFButton.create({ key: '2', alt: 'abc' }),
          Jitsi.DTMFButton.create({ key: '3', alt: 'def' })],
         [Jitsi.DTMFButton.create({ key: '4', alt: 'ghi' }),
          Jitsi.DTMFButton.create({ key: '5', alt: 'jkl' }),
          Jitsi.DTMFButton.create({ key: '6', alt: 'mno' })],
         [Jitsi.DTMFButton.create({ key: '7', alt: 'pqrs' }),
          Jitsi.DTMFButton.create({ key: '8', alt: 'tuv' }),
          Jitsi.DTMFButton.create({ key: '9', alt: 'wxyz' })]]

});

Jitsi.App = Jitsi.View.create({
  id: "jitsi",

  classNames: ['dialer'],

  template: "{dialer}{openLines}{dialpad}",

  dialer: Jitsi.View.create({
    classNames: ['dialer-field'],

    template: '{icon}{field}{callButton}',

    icon: Jitsi.View.create({
      tagName: "table",
      classNames: ["dialpad-icon"],

      title: "Click to open the dial pad",

      template: "<tr><td></td><td></td><td></td></tr>\
                 <tr><td></td><td></td><td></td></tr>\
                 <tr><td></td><td></td><td></td></tr>\
                 <tr><td></td><td></td><td></td></tr>",

      mouseDown: function () {
        var dialpad = Jitsi.App.dialpad;
        if (dialpad.isVisible) {
          dialpad.hide(250);
        } else {
          dialpad.show(250);
        }
      }
    }),

    field: Jitsi.View.create({
      tagName: 'input',
      attributes: ['id', 'type', 'placeholder'],
      type: 'url',
      placeholder: 'Click to begin dialing a number',

      keyDown: function (evt) {
        
      }
    }),

    callButton: Jitsi.View.create({
      tagName: 'button',
      template: "Call"
    })
  }),

  dialpad: Jitsi.Dialpad

});
