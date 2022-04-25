import { FilterOutFalsyValuesFromObjectPipe } from './filter-out-falsy-values-from-object.pipe';

describe('FilterOutFalsyValuesFromObjectPipe', () => {
  it('create an instance', () => {
    const pipe = new FilterOutFalsyValuesFromObjectPipe();
    expect(pipe).toBeTruthy();
  });
});
