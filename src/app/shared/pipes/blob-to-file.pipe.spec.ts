import { BlobToFilePipe } from './blob-to-file.pipe';

describe('BlobToFilePipe', () => {
  it('create an instance', () => {
    const pipe = new BlobToFilePipe();
    expect(pipe).toBeTruthy();
  });
});
