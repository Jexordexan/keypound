import Context from './context'

export class Keypound {
  constructor() {
    this.stack = [];
    document.addEventListener('keypress', (event) => this.onKeyPress(event))
  }
  enter(contextName, options) {
    const i = this.stack.findIndex(c => c.context === contextName)
    if (i > -1) {
      this.moveToTop(i);
    } else {
      this.stack.push(new Context(contextName, this, options))
    }
  }
  exit(contextName) {
    const i = this.stack.findIndex(c => c.context === contextName)
    if (i > -1) {
      this.stack[i] = null
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
    this.stack.push(this.stack.splice(index, 1));
  }
}