import { GetAuthUserPipe } from './get-auth-user.pipe';

describe('GetAuthUserPipe', () => {
  it('create an instance', () => {
    const pipe = new GetAuthUserPipe();
    expect(pipe).toBeTruthy();
  });
});
