import { getKeys, modifiersMatch, parseKey } from './utils';

export default class Context {
  constructor(context, master, options = {}) {
    this.name = context;
    this._filter = options.filter;
    this._block = options.block || false;
    this._paused = false;
    this._master = master;
    this._bindings = {};
  }

  __dispatch(event) {
    if (this._paused) {
      return false;
    }

    const key = event.keyCode;
    let handled = false;

    if (!(key in this._bindings)) {
      return this._block;
    }

    this._bindings[key].filter(binding => modifiersMatch(binding.mods, event)).forEach(binding => {
      if (typeof this._filter === 'function' && !this._filter(event)) {
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

  on(shortcut, handler, options) {
    const keys = getKeys(shortcut);
    keys.forEach(key => {
      if (key in this._master.aliases) {
        key = this._master.aliases[key];
      }

      const parsed = parseKey(key);
      const mods = parsed.mods;
      key = parsed.key;

      if (!(key in this._bindings)) {
        this._bindings[key] = [];
      }

      this._bindings[key].push({ key, handler, mods, options, shortcut });
    });
  }

  off(shortcut, handler) {
    const keys = getKeys(shortcut);
    keys.forEach(key => {
      const parsed = parseKey(key);
      if (parsed.key in this._bindings) {
        const bindings = this._bindings[parsed.key];
        if (handler !== undefined) {
          const deleteIndex = bindings.findIndex(binding => binding.handler === handler);
          if (deleteIndex > -1) {
            bindings.splice(deleteIndex, 1);
          }
        }
        else {
          delete this._bindings[parsed.key];
        }
      }
    });
  }

  exit() {
    this._master.exit(this.name);
  }

  pause() {
    this._paused = true;
  }

  play() {
    this._paused = false;
  }
}
