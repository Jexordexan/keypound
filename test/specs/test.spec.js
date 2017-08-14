import Keypound from 'src';
import { code, MODIFIER_LIST } from 'src/utils';

function keyPress(key, mods = []) {
  const event = document.createEvent('Event');
  event.keyCode = key;
  MODIFIER_LIST.forEach(mod => { event[mod] = mods.includes(mod); });
  event.initEvent('keydown');
  document.dispatchEvent(event);
}

describe('Keypound', () => {
  let master;
  let floor1;
  let floor2;

  beforeEach(() => {
    master = new Keypound();
  });

  it('should create an instance', () => {
    expect(master).toBeDefined();
  });

  it('should trigger an event', () => {
    floor1 = master.enter('floor1');
    const spy = jasmine.createSpy('bpress');
    floor1.on('b', e => spy(e));
    keyPress(code('b'));
    expect(spy).toHaveBeenCalled();
  });

  it('should not trigger an event with the wrong mods', () => {
    floor1 = master.enter('floor1');
    const bspy = jasmine.createSpy('bpress');
    const ctrlbspy = jasmine.createSpy('ctrlbpress');
    floor1.on('b', e => bspy(e));
    floor1.on('ctrl + b', e => ctrlbspy(e));
    keyPress(code('b'), ['ctrlKey']);
    expect(bspy).not.toHaveBeenCalled();
    expect(ctrlbspy).toHaveBeenCalled();
  });

  it('should not trigger an event after being unbound', () => {
    floor1 = master.enter('floor1');
    const bspy = jasmine.createSpy('bpress');
    const ctrlbspy = jasmine.createSpy('ctrlbpress');
    floor1.on('b', e => bspy(e));
    floor1.on('ctrl + b', e => ctrlbspy(e));
    keyPress(code('b'), ['ctrlKey']);
    expect(bspy).not.toHaveBeenCalled();
    expect(ctrlbspy).toHaveBeenCalled();

    floor1.off('b');
    keyPress(code('b'));
    expect(bspy).not.toHaveBeenCalled();
  });

  it('should not trigger an event after being handled', () => {
    floor1 = master.enter('floor1');
    const bspy1 = jasmine.createSpy('bpress1');
    floor1.on('b', e => bspy1(e));
    keyPress(code('b'));
    expect(bspy1).toHaveBeenCalled();

    bspy1.calls.reset();
    const bspy2 = jasmine.createSpy('bpress2');

    floor2 = master.enter('floor2');
    floor2.on('b', e => bspy2(e));
    keyPress(code('b'));
    expect(bspy1).not.toHaveBeenCalled();
    expect(bspy2).toHaveBeenCalled();

    bspy1.calls.reset();
    bspy2.calls.reset();

    floor2.exit();
    keyPress(code('b'));
    expect(bspy1).toHaveBeenCalled();
    expect(bspy2).not.toHaveBeenCalled();
  });

  it('should trigger an event after being re-entered', () => {
    floor1 = master.enter('floor1');
    const bspy1 = jasmine.createSpy('bpress1');
    floor1.on('b', e => bspy1(e));
    keyPress(code('b'));
    expect(bspy1).toHaveBeenCalled();

    bspy1.calls.reset();
    const bspy2 = jasmine.createSpy('bpress2');

    floor2 = master.enter('floor2');
    floor2.on('b', e => bspy2(e));
    keyPress(code('b'));
    expect(bspy1).not.toHaveBeenCalled();
    expect(bspy2).toHaveBeenCalled();

    bspy1.calls.reset();
    bspy2.calls.reset();

    master.enter('floor1');
    keyPress(code('b'));
    expect(bspy1).toHaveBeenCalled();
    expect(bspy2).not.toHaveBeenCalled();
  });

  it('should not trigger an event after being paused', () => {
    floor1 = master.enter('floor1');
    const bspy1 = jasmine.createSpy('bpress1');
    floor1.on('b', e => bspy1(e));
    floor1.pause();
    keyPress(code('b'));
    expect(bspy1).not.toHaveBeenCalled();
    keyPress(code('b'));
    floor1.play();
    keyPress(code('b'));
    expect(bspy1).toHaveBeenCalled();
  });

  it('should trigger if shortcut is unique', () => {
    floor1 = master.enter('floor1');
    floor2 = master.enter('floor2');
    const bspy1 = jasmine.createSpy('bpress1');
    const bspy2 = jasmine.createSpy('bpress2');
    floor1.on('b', e => bspy1(e));
    floor2.on('ctrl + b', e => bspy2(e));
    keyPress(code('b'));
    expect(bspy1).toHaveBeenCalled();
  });
});
