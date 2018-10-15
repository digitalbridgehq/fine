import { Range } from './Range';
describe('Range', () => {
    it('should return an array from between the to and from numbers', () => {
        const range = new Range(0, 5);
        const expected = [0, 1, 2, 3, 4, 5];

        expect(range).toEqual(expected);
    });
    it('should be an array', () => {
        const range = new Range(8, 10);

        expect(Array.isArray(range)).toBe(true);
    });
});
