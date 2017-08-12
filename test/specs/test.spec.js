import Keypound from '../../src';


describe('Hello', () => {
  var master;
  it('should create an instance', () => {
    master = new Keypound();
    expect(master).to.beSet()
  });
});
