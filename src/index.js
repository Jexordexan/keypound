import Context from './context';

export default class Keypound {
  constructor() {
    this.stack = [];
    document.addEventListener('keydown', (event) => this.onKeyPress(event));
  }
  enter(contextName, options) {
    let context = null;
    const i = this.stack.findIndex(c => c.name === contextName);
    if (i > -1) {
      context = this.moveToTop(i);
    }
    else {
      context = this.enterNewContext(contextName, options);
    }
    return context;
  }
  exit(contextName) {
    const i = this.stack.findIndex(c => c.context === contextName);
    if (i > -1) {
      this.stack.splice(index, 1);
    }
  }
  onKeyPress(event) {
    const keyCode = event.keyCodes;
    let i = this.stack.length;
    let handled = false;
    while (!handled && i--) {
      handled = this.stack[i].__dispatch(event);
    }
  }
  moveToTop(index) {
    const context = this.stack.splice(index, 1);
    this.stack.push(context);
    return context;
  }
  enterNewContext(name, options) {
    const context = new Context(name, this, options);
    this.stack.push(context);
    return context;
  }
}
