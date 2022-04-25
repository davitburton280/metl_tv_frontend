import { Base64ToFilePipe } from './base64-to-file.pipe';

describe('Base64ToFilePipe', () => {
  it('create an instance', () => {
    const pipe = new Base64ToFilePipe();
    expect(pipe).toBeTruthy();
  });
});
