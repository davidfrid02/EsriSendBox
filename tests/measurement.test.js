import measuerment from '../widgets/Measurement/measurement'

const { describe, it } = intern.getPlugin('interface.bdd');
const { expect } = intern.getPlugin('chai');

describe('MyClass', () => {
  it('should have a name property when instantiated', () => {
    const obj = new MyClass('foo');
    expect(obj).to.have.property('name', 'foo');
  });
});