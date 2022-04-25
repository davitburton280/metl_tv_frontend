import { CheckForEmptyObjectPipe } from './check-for-empty-object.pipe';

describe('CheckForEmptyObjectPipe', () => {
  it('create an instance', () => {
    const pipe = new CheckForEmptyObjectPipe();
    expect(pipe).toBeTruthy();
  });
});
