import { code, modifiersMatch, getMods, getKeys } from 'src/utils';

describe('Utilities', () => {
  it('should return the correct code', () => {
    expect(code('b')).toEqual(66);
    expect(code('B')).toEqual(66);
    expect(code('backspace')).toEqual(8);
    expect(code(';')).toEqual(186);
    expect(code('f11')).toEqual(122);
    expect(code('\\')).toEqual(220);
  });

  it('should return the correct key bindings', () => {
    const key = 'p, ctrl + v, control + alt + delete, shift + ,';
    const keys = getKeys(key);
    expect(keys).toEqual(['p', 'ctrl+v', 'control+alt+delete', 'shift+,']);
    const keyArray1 = keys[1].split('+');
    const keyArray2 = keys[2].split('+');
    const mods1 = getMods(keyArray1);
    const mods2 = getMods(keyArray2);

    expect(mods1).toEqual({
      metaKey: false,
      shiftKey: false,
      ctrlKey: true,
      altKey: false,
    });

    expect(mods2).toEqual({
      metaKey: false,
      shiftKey: false,
      ctrlKey: true,
      altKey: true,
    });
  });

  it('should tell if modifiers match', () => {
    const mod1 = {
      metaKey: false,
      shiftKey: false,
      ctrlKey: true,
      altKey: false,
    };

    const mod2 = {
      metaKey: false,
      shiftKey: false,
      ctrlKey: true,
      altKey: false,
    };

    const mod3 = {
      metaKey: false,
      shiftKey: false,
      ctrlKey: false,
      altKey: false,
    };

    const mod4 = {
      metaKey: false,
      shiftKey: false,
      ctrlKey: true,
    };

    expect(modifiersMatch(mod1, mod2)).toBe(true);
    expect(modifiersMatch(mod1, mod3)).toBe(false);
    expect(modifiersMatch(mod1, mod4)).toBe(false);
  });
});
