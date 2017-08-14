export const MODIFIERS = {
  '⇧': 16, shift: 16,
  '⌥': 18, alt: 18, option: 18,
  '⌃': 17, ctrl: 17, control: 17,
  '⌘': 91, command: 91,
};

export const MODIFIER_MAP = {
  16: 'shiftKey',
  18: 'altKey',
  17: 'ctrlKey',
  91: 'metaKey',
};

export const MODIFIER_LIST = Object.keys(MODIFIER_MAP).map(keyCode => MODIFIER_MAP[keyCode]);

// special keys
export const MAP = {
  backspace: 8, tab: 9, clear: 12,
  enter: 13, 'return': 13,
  esc: 27, escape: 27, space: 32,
  left: 37, up: 38,
  right: 39, down: 40,
  del: 46, 'delete': 46,
  home: 36, end: 35,
  pageup: 33, pagedown: 34,
  ',': 188, '.': 190, '/': 191,
  '`': 192, '-': 189, '=': 187,
  ';': 186, '\'': 222,
  '[': 219, ']': 221, '\\': 220,
};

for (let k = 1; k < 20; k++) {
  MAP['f' + k] = 111 + k;
}

export function code(x) {
  return MAP[x] || x.toUpperCase().charCodeAt(0);
}

export function getKeys(key) {
  const keys = key.replace(/\s/g, '').split(',');
  if ((keys[keys.length - 1]) === '') {
    keys[keys.length - 2] += ',';
  }
  return keys;
}

// abstract mods logic for assign and unassign
export function getMods(key) {
  const _mods = {
    shiftKey: false,
    altKey: false,
    ctrlKey: false,
    metaKey: false,
  };
  key.slice(0, -1).forEach(mod => {
    const keyCode = MODIFIERS[mod];
    const modName = MODIFIER_MAP[keyCode];
    _mods[modName] = true;
  });
  return _mods;
}

export function modifiersMatch(mods, event) {
  return MODIFIER_LIST.every(modName => mods[modName] === event[modName]);
}
