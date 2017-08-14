import { code, getKeys, getMods, modifiersMatch } from './utils';

export default class Context {
  constructor(context, master, options = {}) {
    this.name = context;
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

    this._bindings[key]
      .filter(binding => modifiersMatch(binding.mods, event))
      .forEach(binding => {
        if (binding.options && binding.options.prevent) {
          event.preventDefault();
        }
        binding.handler(event, binding);
        handled = true;
      });

    return handled;
  }

  on(shortcut, handler, options) {
    const keys = getKeys(shortcut);
    keys.forEach(key => {
      let mods = [];
      key = key.split('+');
      mods = getMods(key);
      if (key.length > 1) {
        key = [key[key.length - 1]];
      }
      key = key[0];
      key = code(key);

      if (!(key in this._bindings)) {
        this._bindings[key] = [];
      }

      this._bindings[key].push({ key, handler, mods, options, shortcut });
    });
  }

  off(shortcut) {
    const keys = getKeys(shortcut);
    keys.forEach(key => {
      key = key.split('+');
      if (key.length > 1) {
        key = [key[key.length - 1]];
      }
      key = key[0];
      key = code(key);

      if (key in this._bindings) {
        delete this._bindings[key];
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
