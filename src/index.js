import Context from './context';

export default class Keypound {
  constructor() {
    this.stack = [];
    document.addEventListener('keydown', (event) => this.onKeyPress(event));
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
  enterNewContext(name, options) {
    const context = new Context(name, this, options);
    this.stack.push(context);
    return context;
  }
  getStackIndex(contextName) {
    return this.stack.findIndex(c => c.name === contextName);
  }
}
