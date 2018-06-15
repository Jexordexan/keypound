import Context from './context';
import { MAP, MODIFIERS } from './utils';

export default class Keypound {
  constructor(options = {}) {
    this.stack = [];
    this.aliases = {};
    this.keyEvent = options.keyEvent || 'keydown';
    this.filter =
      options.defaultFilter || (event => event.target.nodeName !== 'INPUT' && event.target.nodeName !== 'TEXTAREA');
    this.__globalHandler = event => this.onKeyPress(event);
    document.addEventListener(this.keyEvent, this.__globalHandler);

    if (options.createRoot || typeof options.createRoot === 'undefined') {
      this.enter('root');
    }
  }
  createAlias(alias, key) {
    // TODO Write validator for shortcut
    const validAlias = !(alias in MAP) && !(alias in MODIFIERS);
    if (!validAlias) {
      throw new Error(`Bad alias: '${alias}' is reserved`);
    }

    const validKey = true;
    if (!validKey) {
      throw new Error(`Bad key: '${key}' is incorrectly formatted`);
    }

    this.aliases[alias] = key;
  }
  enter(contextName, options) {
    let context = null;
    const i = this.getStackIndex(contextName);
    if (i > -1) {
      context = this.moveToTop(i);
    }
    else {
      context = this.enterNewContext(contextName, options);
    }
    return context;
  }
  exit(contextName) {
    const i = this.getStackIndex(contextName);
    if (i > -1) {
      return this.stack.splice(i, 1);
    }
    return null;
  }
  onKeyPress(event) {
    let i = this.stack.length;
    let handled = false;
    while (!handled && i--) {
      handled = this.stack[i].__dispatch(event);
    }
  }
  moveToTop(index) {
    const [context] = this.stack.splice(index, 1);
    this.stack.push(context);
    return context;
  }
  enterNewContext(name, options = {}) {
    options.filter = options.filter || this.filter;
    const context = new Context(name, this, options);
    this.stack.push(context);
    return context;
  }
  getStackIndex(contextName) {
    return this.stack.findIndex(c => c.name === contextName);
  }
  destroy() {
    document.removeEventListener(this.keyEvent, this.__globalHandler);
  }
}
