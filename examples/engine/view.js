/* globals Jitsi */

/**
  Simple templated views.
  @extends Jitsi.Base
 */
Jitsi.View = Jitsi.Base.extend(
  /** @scope Jitsi.View */{

  /**
    Globally unique identifier
    @type Number
    @default 0
   */
  __guid__: 0,

  /**
    Whether the view is visible or not.
    @type Boolean
    @default true
   */
  isVisible: true,

  attributes: ['title', 'id'],

  /**
    The tag name to use to render this view.
    @type String
    @default 'div'
   */
  tagName: "div",

  /**
    The toolTip to show on mouse hover.
    @type String
    @default null
   */
  toolTip: "",

  /**
    The class names to apply to the view.
    @type Array
    @default []
   */
  classNames: [],

  /**
    The HTML template to use for rendering
    the element. The context used in formatting
    will be the current view.
    @type String
    @default ""
   */
  template: "",

  /**
    The CSS ID of the view.
    @type String
    @default null
   */
  id: null,

  /**
    Renders the contents of the view.
   */
  render: function () {
    var el = this.$();
    el.attr(this.attrs);
    if (!this.isVisible) el.css('display', 'none');
    el.attr('class', this.classNames.join(' '));
    el.html(Jitsi.format(this.template, this));
  },

  /**
    Allow for nested templates.
   */
  toString: function () {
    var that = this;
    if (this.id === null) {
      this.id = "jitsi-" + (Jitsi.View.__guid__++);
      $("#" + this.id).live({
         mouseup: function () { that.mouseUp.apply(that, arguments); },
         mousedown: function () { that.mouseDown.apply(that, arguments); },
         click: function () { that.click.apply(that, arguments); },
         keyup: function () { that.keyUp.apply(that, arguments); },
         keydown: function () { that.keyDown.apply(that, arguments); }
      });
    }
    var attrs = "", key;
    for (var attr in this.attributes) {
      key = this.attributes[attr];
      if (this[key]) {
        attrs += " " + key + "='" + this[key].toString() + "'";
      }
    }

    return Jitsi.format("<{0} class='{1}'{2}>{3}</{0}>",
                        this.tagName, this.classNames.join(' '),
                        attrs, Jitsi.format(this.template, this));
  },

  /**
    Returns the element.
    @type jQuery
   */
  $: function () {
    return $("#" + this.id);
  },

  /**
    Hides the view.
    @param {Object} animation The animation to apply.
    @returns {void}
   */
  hide: function (duration) {
    this.isVisible = false;
    this.$().fadeOut(duration);
  },

  /**
    Shows the view.
    @param {Object} animation The animation to apply.
    @returns {void}
   */
  show: function (duration) {
    this.isVisible = true;
    this.$().fadeIn(duration);
  },

  mouseDown: function () {},

  mouseUp: function () {},

  click: function () {},

  keyUp: function () {},

  keyDown: function () {}

});
