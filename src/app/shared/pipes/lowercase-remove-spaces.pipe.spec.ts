import { LowercaseRemoveSpacesPipe } from './lowercase-remove-spaces.pipe';

describe('LowercaseRemoveSpacesPipe', () => {
  it('create an instance', () => {
    const pipe = new LowercaseRemoveSpacesPipe();
    expect(pipe).toBeTruthy();
  });
});
