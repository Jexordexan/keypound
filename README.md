# Keypound

### Scoped key binding library with context stacking and ES6 out of the box
[![Build Status](https://travis-ci.org/Jexordexan/keypound.svg?branch=master)](https://travis-ci.org/Jexordexan/keypound)

This is a library aimed at making scoped key bindings in large apps a breeze.

Sometimes in large applications, you need the same shortcut to perform different tasks in different places. For instance, you might need the `up` and `down` arrows to move around different lists depending on where your focus was last.

Often we resort to using `event.stopPropagation()` and `event.preventDefault()`, to prevent the keys from bubbling up, but we should really be creating a context stack and telling our code which context we are in, and which context will next receive events that haven't been handled.
