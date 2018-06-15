import Keypound from 'src';
import { code } from 'src/utils';
import { keyPress } from './helpers';

describe('Keypound', () => {
  let filterSpy;
  let master;
  let floor1;
  let floor2;

  beforeEach(() => {
    filterSpy = jasmine.createSpy('filter');
    filterSpy.and.returnValue(true);
    master = new Keypound({
      defaultFilter: filterSpy,
    });
  });

  afterEach(() => {
    master.destroy();
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
    const cspy = jasmine.createSpy('cpress');
    const ctrlcspy = jasmine.createSpy('ctrlcpress');
    floor1.on('c', e => cspy(e));
    floor1.on('ctrl + c', e => ctrlcspy(e));
    keyPress(code('c'), ['ctrlKey']);
    expect(cspy).not.toHaveBeenCalled();
    expect(ctrlcspy).toHaveBeenCalled();
  });

  it('should not trigger an event after being unbound by shortcut', () => {
    floor1 = master.enter('floor1');
    const dspy = jasmine.createSpy('dpress');
    const ctrldspy = jasmine.createSpy('ctrldpress');
    floor1.on('d', e => dspy(e));
    floor1.on('ctrl + d', e => ctrldspy(e));
    keyPress(code('d'), ['ctrlKey']);
    expect(dspy).not.toHaveBeenCalled();
    expect(ctrldspy).toHaveBeenCalled();

    floor1.off('d');
    keyPress(code('d'));
    expect(dspy).not.toHaveBeenCalled();
  });

  it('should not trigger an event after being unbound by handler', () => {
    floor1 = master.enter('floor1');
    const spy1 = jasmine.createSpy('keypress1');
    const spy2 = jasmine.createSpy('keypress2');
    floor1.on('e', spy1);
    floor1.on('e', spy2);
    floor1.off('e', null);
    keyPress(code('e'));
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();

    spy1.calls.reset();
    spy2.calls.reset();

    floor1.off('e', spy2);
    keyPress(code('e'));
    expect(spy1).toHaveBeenCalled();
    expect(spy2).not.toHaveBeenCalled();
  });

  it('should not trigger an event after being handled', () => {
    floor1 = master.enter('floor1');
    const spy1 = jasmine.createSpy('keypress1');
    floor1.on('f', e => spy1(e));
    keyPress(code('f'));
    expect(spy1).toHaveBeenCalled();

    spy1.calls.reset();
    const spy2 = jasmine.createSpy('keypress2');

    floor2 = master.enter('floor2');
    floor2.on('f', e => spy2(e));
    keyPress(code('f'));
    expect(spy1).not.toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();

    spy1.calls.reset();
    spy2.calls.reset();

    floor2.exit();
    keyPress(code('f'));
    expect(spy1).toHaveBeenCalled();
    expect(spy2).not.toHaveBeenCalled();
  });

  it('should trigger an event after being re-entered', () => {
    floor1 = master.enter('floor1');
    const spy1 = jasmine.createSpy('keypress1');
    floor1.on('g', e => spy1(e));
    keyPress(code('g'));
    expect(spy1).toHaveBeenCalled();

    spy1.calls.reset();
    const spy2 = jasmine.createSpy('keypress2');

    floor2 = master.enter('floor2');
    floor2.on('g', e => spy2(e));
    keyPress(code('g'));
    expect(spy1).not.toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();

    spy1.calls.reset();
    spy2.calls.reset();

    master.enter('floor1');
    keyPress(code('g'));
    expect(spy1).toHaveBeenCalled();
    expect(spy2).not.toHaveBeenCalled();
  });

  it('should not trigger an event after being paused', () => {
    floor1 = master.enter('floor1');
    const spy1 = jasmine.createSpy('keypress1');
    floor1.on('h', e => spy1(e));
    floor1.pause();
    keyPress(code('h'));
    expect(spy1).not.toHaveBeenCalled();
    keyPress(code('h'));
    floor1.play();
    keyPress(code('h'));
    expect(spy1).toHaveBeenCalled();
  });

  it('should trigger if shortcut is unique', () => {
    floor1 = master.enter('floor1');
    floor2 = master.enter('floor2');
    const spy1 = jasmine.createSpy('keypress1');
    const spy2 = jasmine.createSpy('keypress2');
    floor1.on('i', e => spy1(e));
    floor2.on('ctrl + i', e => spy2(e));
    keyPress(code('i'));
    expect(spy1).toHaveBeenCalled();
  });

  it('should correctly filter events', () => {
    const filter = jasmine.createSpy('inner filter');
    filter.and.returnValue(false);

    floor1 = master.enter('floor1');
    floor2 = master.enter('floor2', { filter });
    const spy1 = jasmine.createSpy('keypress1');
    const spy2 = jasmine.createSpy('keypress2');
    floor1.on('j', e => spy1(e));
    floor2.on('j', e => spy2(e));
    keyPress(code('j'));
    expect(filter).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).not.toHaveBeenCalled();
  });

  it('should correctly alias shortcuts', () => {
    master.createAlias('alias', 'k');
    expect(() => {
      master.createAlias('command', 'ctrl + k');
    }).toThrow(new Error('Bad alias: \'command\' is reserved'));

    floor1 = master.enter('floor1');
    const spy1 = jasmine.createSpy('keypress1');
    floor1.on('alias', e => spy1(e));
    keyPress(code('k'));
    expect(spy1).toHaveBeenCalled();
  });

  it('should properly unbind listeners when destroyed', () => {
    let tempMaster = new Keypound();
    floor1 = tempMaster.enter('floor1');
    const spy1 = jasmine.createSpy('keypress1');
    floor1.on('k', e => spy1(e));
    keyPress(code('k'));
    expect(spy1).toHaveBeenCalled();

    spy1.calls.reset();

    tempMaster.destroy();
    tempMaster = null;

    keyPress(code('k'));
    expect(spy1).not.toHaveBeenCalled();
  });
});
