import Keypound from 'src';
import { code, MODIFIER_LIST } from 'src/code';

function keyPress(key, mods = []) {
  const event = document.createEvent('Event');
  event.keyCode = key;
  MODIFIER_LIST.forEach(mod => event[mod] = mods.includes(mod));
  event.initEvent('keydown');
  document.dispatchEvent(event);
}

describe('Keypound', () => {
  let master;

  beforeEach(() => {
    master = new Keypound();
  });

  it('should create an instance', () => {
    expect(master).toBeDefined();
  });

  it('should trigger an event', () => {
    const floor1 = master.enter('floor1');
    const spy = jasmine.createSpy('bpress');
    floor1.on('b', e => spy());
    keyPress(code('b'));
    expect(spy).toHaveBeenCalled();
  });

  it('should not trigger an event with the wrong mods', () => {
    const floor1 = master.enter('floor1');
    const bspy = jasmine.createSpy('bpress');
    const ctrlbspy = jasmine.createSpy('ctrlbpress');
    floor1.on('b', e => bspy());
    floor1.on('ctrl + b', e => ctrlbspy());
    keyPress(code('b'), ['ctrlKey']);
    expect(bspy).not.toHaveBeenCalled();
    expect(ctrlbspy).toHaveBeenCalled();
  });

  it('should not trigger an event after being unbound', () => {
    const floor1 = master.enter('floor1');
    const bspy = jasmine.createSpy('bpress');
    const ctrlbspy = jasmine.createSpy('ctrlbpress');
    floor1.on('b', e => bspy());
    floor1.on('ctrl + b', e => ctrlbspy());
    keyPress(code('b'), ['ctrlKey']);
    expect(bspy).not.toHaveBeenCalled();
    expect(ctrlbspy).toHaveBeenCalled();

    floor1.off('b');
    keyPress(code('b'));
    expect(bspy).not.toHaveBeenCalled();
  });
});
