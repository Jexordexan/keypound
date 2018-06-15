import { MODIFIER_LIST } from 'src/utils';

export function keyPress(key, mods = [], eventName = 'keydown') {
  const event = document.createEvent('Event');
  event.keyCode = key;
  MODIFIER_LIST.forEach(mod => { event[mod] = mods.includes(mod); });
  event.initEvent(eventName);
  document.dispatchEvent(event);
}
