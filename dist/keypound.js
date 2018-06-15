(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.keypound = factory());
}(this, (function () { 'use strict';

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

var MODIFIER_LIST = Object.keys(MODIFIER_MAP).map(function (keyCode) {
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

function parseKey(key) {
  var mods = [];
  key = key.split('+');
  mods = getMods(key);
  if (key.length > 1) {
    key = [key[key.length - 1]];
  }
  key = key[0];
  key = code(key);
  return { key: key, mods: mods };
}

function modifiersMatch(mods, event) {
  return MODIFIER_LIST.every(function (modName) {
    return mods[modName] === event[modName];
  });
}

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();



























var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

var Context = function () {
  function Context(context, master) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    classCallCheck(this, Context);

    this.name = context;
    this._filter = options.filter;
    this._block = options.block || false;
    this._paused = false;
    this._master = master;
    this._bindings = {};
  }

  createClass(Context, [{
    key: '__dispatch',
    value: function __dispatch(event) {
      var _this = this;

      if (this._paused) {
        return false;
      }

      var key = event.keyCode;
      var handled = false;

      if (!(key in this._bindings)) {
        return this._block;
      }

      this._bindings[key].filter(function (binding) {
        return modifiersMatch(binding.mods, event);
      }).forEach(function (binding) {
        if (typeof _this._filter === 'function' && !_this._filter(event)) {
          return;
        }
        if (binding.options && binding.options.prevent) {
          event.preventDefault();
        }
        // console.log('triggering');
        binding.handler(event, binding);
        handled = true;
      });

      return handled;
    }
  }, {
    key: 'on',
    value: function on(shortcut, handler, options) {
      var _this2 = this;

      var keys = getKeys(shortcut);
      keys.forEach(function (key) {
        if (key in _this2._master.aliases) {
          key = _this2._master.aliases[key];
        }

        var parsed = parseKey(key);
        var mods = parsed.mods;
        key = parsed.key;

        if (!(key in _this2._bindings)) {
          _this2._bindings[key] = [];
        }

        _this2._bindings[key].push({ key: key, handler: handler, mods: mods, options: options, shortcut: shortcut });
      });
    }
  }, {
    key: 'off',
    value: function off(shortcut, handler) {
      var _this3 = this;

      var keys = getKeys(shortcut);
      keys.forEach(function (key) {
        var parsed = parseKey(key);
        if (parsed.key in _this3._bindings) {
          var bindings = _this3._bindings[parsed.key];
          if (handler !== undefined) {
            var deleteIndex = bindings.findIndex(function (binding) {
              return binding.handler === handler;
            });
            if (deleteIndex > -1) {
              bindings.splice(deleteIndex, 1);
            }
          } else {
            delete _this3._bindings[parsed.key];
          }
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

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    classCallCheck(this, Keypound);

    this.stack = [];
    this.aliases = {};
    this.keyEvent = options.keyEvent || 'keydown';
    this.filter = options.defaultFilter || function (event) {
      return event.target.nodeName !== 'INPUT' && event.target.nodeName !== 'TEXTAREA';
    };
    this.__globalHandler = function (event) {
      return _this.onKeyPress(event);
    };
    document.addEventListener(this.keyEvent, this.__globalHandler);

    if (options.createRoot || typeof options.createRoot === 'undefined') {
      this.enter('root');
    }
  }

  createClass(Keypound, [{
    key: 'createAlias',
    value: function createAlias(alias, key) {
      // TODO Write validator for shortcut
      var validAlias = !(alias in MAP) && !(alias in MODIFIERS);
      if (!validAlias) {
        throw new Error('Bad alias: \'' + alias + '\' is reserved');
      }

      var validKey = true;
      if (!validKey) {
        throw new Error('Bad key: \'' + key + '\' is incorrectly formatted');
      }

      this.aliases[alias] = key;
    }
  }, {
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
        return this.stack.splice(i, 1);
      }
      return null;
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
          _stack$splice2 = slicedToArray(_stack$splice, 1),
          context = _stack$splice2[0];

      this.stack.push(context);
      return context;
    }
  }, {
    key: 'enterNewContext',
    value: function enterNewContext(name) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      options.filter = options.filter || this.filter;
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
  }, {
    key: 'destroy',
    value: function destroy() {
      document.removeEventListener(this.keyEvent, this.__globalHandler);
    }
  }]);
  return Keypound;
}();

return Keypound;

})));
