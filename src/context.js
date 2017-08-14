import { code, getKeys, getMods, modifiersMatch } from './code';

export default class Context {
  constructor(context, master, options = {}) {
    this.name = context;
    this.block = options.block || false;
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
      return this.block;
    }

    this._bindings[key]
      .filter(binding => modifiersMatch(binding.mods, event))
      .forEach(binding => {
        binding.handler(event, binding);
        handled = true;
      });

    return handled;
  }

  on(shortcut, handler) { // TODO add binding options
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

      this._bindings[key].push({ key, handler, mods });
    });
  }

  off(shortcut) {
    if (shortcut) {
      delete this._bindings[code(shortcut)];
    }
  }

  exit() {
    this.master.exit(this.context);
  }

  pause() {
    this.paused = true;
  }

  play() {
    this.paused = false;
  }
}
