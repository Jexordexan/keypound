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
    console.log(event)

    let key = event.keyCode;

    if (!(key in this._bindings)) {
      return this.block;
    }

    this._bindings[key].forEach(binding => {
      if (modifiersMatch(binding.mods, event)) {
        binding.handler(event, binding);
        return true;
      }
    });
  }

  on(shortcut, handler, options) {
    let keys = getKeys(shortcut);
    keys.forEach(key => {
      let mods = [];
      key = key.split('+');
      if (key.length > 1){
        mods = getMods(key);
        key = [key[key.length-1]];
      }
      key = key[0]
      key = code(key);

      if (!(key in this._bindings)) {
        this._bindings[key] = [];
      }

      this._bindings[key].push({ key, handler, mods });
    })
  }

  off(shortcut) {
    if (shortcut) {
      delete this.bindings[shortcut];
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
