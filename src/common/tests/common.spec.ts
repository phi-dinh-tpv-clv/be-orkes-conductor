import { isPhoneNumber } from '../validations/helpers';

const regexp = /[]/;

describe('regular expression', function () {
  it('to be false', function () {
    // expect(regexp.test('a4b')).toBe(false);
    // expect(regexp.test('f8a')).toBe(false);
    // expect(regexp.test('e2f')).toBe(false);
    expect(isPhoneNumber('+12 123 123 123')).toBe(true);
    // expect(isPhoneNumber(12)).toBe(true);
  });
});
