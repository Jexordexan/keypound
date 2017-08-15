# Keypound.js

### Scoped key binding library with context stacking and ES6 out of the box. Based on [Keymaster.js](https://github.com/madrobby/keymaster)
[![Build Status](https://travis-ci.org/Jexordexan/keypound.svg?branch=master)](https://travis-ci.org/Jexordexan/keypound)

This is a dependency-free library aimed at making scoped key bindings in large apps a breeze.

Sometimes in large applications, you need the same shortcut to perform different tasks in different places. For instance, you might need the `up` and `down` arrows to move around different lists depending on where your focus was last.

Often we resort to using `event.stopPropagation()` and `event.preventDefault()`, to prevent the keys from bubbling up, but we should really be creating a context stack and telling our code which context we are in, and which context will next receive events that haven't been handled.

## Getting Started

### Installation
* Using `npm`:
```bash
npm install keypound
```
* Using `yarn`:
```bash
yarn add keypound
```

### Creating an instance
To get started with keypound, you'll need to create a master instance:

```javascript
// master.js
import Keypound from 'keypound'

const master = new Keypound()
export default master
```

### Registering a context
After creating a master instance you can import it into any module and enter your first context

```javascript
// my-module.js

import master from './master'

const context = master.enter('module-context')
```
### Binding to a shortcut
Once you've registered a context, you can start binding some shortcuts!

```javascript
context.on('down, tab', () => this.moveDown())
context.on('up, shift + tab', () => this.moveUp())
```
This will cause `moveDown` to fire anytime the down arrow or tab key is pressed.
Likewise, `moveUp` will fire anytime the up arrow or shift-tab is pressed.

### Multiple contexts
Anytime the user enters a new context (open a modal or dialog) you tell the master instance to enter a new context and add your new bindings.

```javascript
const modalContext = master.enter('modal-context')
```

Every new context stacks on top of the contexts that have already been entered. All bindings are given to the context at the top of the stack (the most recent) and then fall down the stack until they are handled.

Once a shortcut is handled, it will stop cascading down the stack.

### Re-entering contexts
If a user goes back to a previous context without exiting the current one (maybe they clicked on a different area of the app), you can re-enter that context with all the same bindings, but now it is at the top of the stack.

You do this by calling `enter()` with the same context name.

```javascript
master.enter('previous-context')
```
Afterwards, all bindings will take top priority once again.

### Exiting contexts
When a modal closes, you will want to remove that context from the stack entirely. There are two ways to do this.

1. Exit the context from the master:
```javascript
  master.exit('modal-context')
```
2. Exit the context using the context reference:
```javascript
  modalContext.exit()
```

### Pausing and playing contexts
Sometimes you will need to keep a contexts spot in the stack but stop your shortcut handlers from firing.

Thankfully, you can call `.pause()` on your context to pause any handling, and then call `.play()` when you are ready to start responding to shortcuts again.

Note: Since your handlers will not be firing, any duplicate shortcuts down the stack will still fire. To prevent this, either have your handler decide whether or not to do anything, or use the `block: true` option when creating your context for the first time.

# API
Below are the interfaces for each object type in the library

## Keypound instance

You should really only have one of these in your app. If you need more, make sure you are careful about which is responsible for what.

### Constructor
```javascript
const master = new Keypound();
```
### Methods
* `enter(contextName, options)`
  * returns `Context` instance used for shortcut bindings.
* `exit(contextName)`
  * returns `Context` instance if found, `null` if there was no match.
* `getStackIndex(contextName)`
  * returns `number` of where the context lies in the stack.

### Context options
When creating a new context, you can supply options for how shortcuts are handled:

* `block: boolean`: if true, stops all shortcuts at this context, even if they have no handler.

## Context instance

### Methods
* `on(shortcut, handler, options)`
  * `shortcut`: See Creating a shortcut
  * `handler`: See handler
  * `options`: any of the following
    * `prevent: boolean`: call `event.preventDefault` if set to `true`
* `off(shortcut)`: removes a shortcuts handler from the context.
* `exit()`: removes the context from the master stack.
* `pause()`: temporarily stop handlers from firing and allow shortcuts to cascade the stack.
* `play()`: resume handling of shortcuts.

### Creating a shortcut
Shortcuts are written in as `[modifiers] + [key]` combos, separated by commas.
Everything below is a valid shortcut:

* `d, control + m`
* `alt + C`
* `shift + p`
* `⇧ + ⌘ + left`
* `space, ctrl + space, alt + tab`
* `ctrl + alt + delete`

### Supported keys
Keypound understands the following modifiers:
`⇧`, `shift`, `option`, `⌥`, `alt`, `ctrl`, `control`, `command`, and `⌘`.

The following special keys can be used for shortcuts:
`backspace`, `tab`, `clear`, `enter`, `return`, `esc`, `escape`, `space`,
`up`, `down`, `left`, `right`, `home`, `end`, `pageup`, `pagedown`, `del`, `delete`
and `f1` through `f19`.

### Handler
Each handler is given two arguments, `event` and `binding`.
* `event`: The native `keydown` event that matched the shortcut
* `binding`: The information associated with the binding
  * `key`: a `number` representing the keyCode that triggered the event
  * `mods`: a map of `KeyEvent` modifiers and a `boolean` indicating if they are required for the shortcut.
  * `options`: any options passed to the initial binding
  * `handler`: the callback itself

## Contributing

To contribute, please fork Keypound.js, add your patch and tests for it (in the `test/specs` folder), run `npm test`, and submit a pull request.

## TODO
- More docs
- More examples
- Better edge-case testing
