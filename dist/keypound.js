(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('babel-runtime/helpers/slicedToArray'), require('babel-runtime/helpers/classCallCheck'), require('babel-runtime/helpers/createClass'), require('babel-runtime/core-js/object/keys')) :
	typeof define === 'function' && define.amd ? define(['babel-runtime/helpers/slicedToArray', 'babel-runtime/helpers/classCallCheck', 'babel-runtime/helpers/createClass', 'babel-runtime/core-js/object/keys'], factory) :
	(global.keypound = factory(global._slicedToArray,global._classCallCheck,global._createClass,global._Object$keys));
}(this, (function (_slicedToArray,_classCallCheck,_createClass,_Object$keys) { 'use strict';

_slicedToArray = _slicedToArray && _slicedToArray.hasOwnProperty('default') ? _slicedToArray['default'] : _slicedToArray;
_classCallCheck = _classCallCheck && _classCallCheck.hasOwnProperty('default') ? _classCallCheck['default'] : _classCallCheck;
_createClass = _createClass && _createClass.hasOwnProperty('default') ? _createClass['default'] : _createClass;
_Object$keys = _Object$keys && _Object$keys.hasOwnProperty('default') ? _Object$keys['default'] : _Object$keys;

var MODIFIERS = {
  '⇧': 16, shift: 16,
  '⌥': 18, alt: 18, option: 18,
  '⌃': 17, ctrl: 17, control: 17,
  '⌘': 91, command: 91
};

var MODIFIER_MAP = {
  16: 'shiftKey',
  18: 'altKey',
  17: 'ctrlKey',
  91: 'metaKey'
};

var MODIFIER_LIST = _Object$keys(MODIFIER_MAP).map(function (keyCode) {
  return MODIFIER_MAP[keyCode];
});

// special keys
var MAP = {
  backspace: 8, tab: 9, clear: 12,
  enter: 13, 'return': 13,
  esc: 27, escape: 27, space: 32,
  left: 37, up: 38,
  right: 39, down: 40,
  del: 46, 'delete': 46,
  home: 36, end: 35,
  pageup: 33, pagedown: 34,
  ',': 188, '.': 190, '/': 191,
  '`': 192, '-': 189, '=': 187,
  ';': 186, '\'': 222,
  '[': 219, ']': 221, '\\': 220
};

for (var k = 1; k < 20; k++) {
  MAP['f' + k] = 111 + k;
}

function code(x) {
  return MAP[x] || x.toUpperCase().charCodeAt(0);
}

function getKeys(key) {
  var keys = key.replace(/\s/g, '').split(',');
  var last = keys.length - 1;
  if (keys[last] === '') {
    keys[last - 1] += ',';
    keys = keys.slice(0, -1);
  }
  return keys;
}

// abstract mods logic for assign and unassign
function getMods(key) {
  var _mods = {
    shiftKey: false,
    altKey: false,
    ctrlKey: false,
    metaKey: false
  };
  key.slice(0, -1).forEach(function (mod) {
    var keyCode = MODIFIERS[mod];
    var modName = MODIFIER_MAP[keyCode];
    _mods[modName] = true;
  });
  return _mods;
}

function modifiersMatch(mods, event) {
  return MODIFIER_LIST.every(function (modName) {
    return mods[modName] === event[modName];
  });
}

var Context = function () {
  function Context(context, master) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, Context);

    this.name = context;
    this._block = options.block || false;
    this._paused = false;
    this._master = master;
    this._bindings = {};
  }

  _createClass(Context, [{
    key: '__dispatch',
    value: function __dispatch(event) {
      if (this._paused) {
        return false;
      }

      var key = event.keyCode;

      if (!(key in this._bindings)) {
        return this._block;
      }

      this._bindings[key].filter(function (binding) {
        return modifiersMatch(binding.mods, event);
      }).forEach(function (binding) {
        return binding.handler(event, binding);
      });

      return true;
    }
  }, {
    key: 'on',
    value: function on(shortcut, handler, options) {
      var _this = this;

      var keys = getKeys(shortcut);
      keys.forEach(function (key) {
        var mods = [];
        key = key.split('+');
        mods = getMods(key);
        if (key.length > 1) {
          key = [key[key.length - 1]];
        }
        key = key[0];
        key = code(key);

        if (!(key in _this._bindings)) {
          _this._bindings[key] = [];
        }

        _this._bindings[key].push({ key: key, handler: handler, mods: mods, options: options });
      });
    }
  }, {
    key: 'off',
    value: function off(shortcut) {
      var _this2 = this;

      var keys = getKeys(shortcut);
      keys.forEach(function (key) {
        key = key.split('+');
        if (key.length > 1) {
          key = [key[key.length - 1]];
        }
        key = key[0];
        key = code(key);

        if (key in _this2._bindings) {
          delete _this2._bindings[key];
        }
      });
    }
  }, {
    key: 'exit',
    value: function exit() {
      this._master.exit(this.name);
    }
  }, {
    key: 'pause',
    value: function pause() {
      this._paused = true;
    }
  }, {
    key: 'play',
    value: function play() {
      this._paused = false;
    }
  }]);

  return Context;
}();

var Keypound = function () {
  function Keypound() {
    var _this = this;

    _classCallCheck(this, Keypound);

    this.stack = [];
    document.addEventListener('keydown', function (event) {
      return _this.onKeyPress(event);
    });
  }

  _createClass(Keypound, [{
    key: 'enter',
    value: function enter(contextName, options) {
      var context = null;
      var i = this.getStackIndex(contextName);
      if (i > -1) {
        context = this.moveToTop(i);
      } else {
        context = this.enterNewContext(contextName, options);
      }
      return context;
    }
  }, {
    key: 'exit',
    value: function exit(contextName) {
      var i = this.getStackIndex(contextName);
      if (i > -1) {
        this.stack.splice(i, 1);
      }
    }
  }, {
    key: 'onKeyPress',
    value: function onKeyPress(event) {
      var i = this.stack.length;
      var handled = false;
      while (!handled && i--) {
        handled = this.stack[i].__dispatch(event);
      }
    }
  }, {
    key: 'moveToTop',
    value: function moveToTop(index) {
      var _stack$splice = this.stack.splice(index, 1),
          _stack$splice2 = _slicedToArray(_stack$splice, 1),
          context = _stack$splice2[0];

      this.stack.push(context);
      return context;
    }
  }, {
    key: 'enterNewContext',
    value: function enterNewContext(name, options) {
      var context = new Context(name, this, options);
      this.stack.push(context);
      return context;
    }
  }, {
    key: 'getStackIndex',
    value: function getStackIndex(contextName) {
      return this.stack.findIndex(function (c) {
        return c.name === contextName;
      });
    }
  }]);

  return Keypound;
}();

return Keypound;

})));
