import Keypound from 'src';
import { code } from 'src/code';

function keyPress(key, mods) {
  const event = document.createEvent('Event');
  event.keyCode = key;
  if (mods) {
    mods.forEach(mod => event[mod] = true)
  }
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
    var spy = jasmine.createSpy('bpress');
    floor1.on('b', e => spy());
    keyPress(code('b'));
    expect(spy).toHaveBeenCalled();
  });

  it('should not trigger an event', () => {
    const floor1 = master.enter('floor1');
    var spy = jasmine.createSpy('bpress');
    floor1.on('b', e => spy());
    keyPress(code('b'), ['ctrlKey']);
    expect(spy).toHaveBeenCalled();
  });
});
