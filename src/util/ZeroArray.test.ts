import { ZeroArray } from './ZeroArray';

describe('ZeroArray', () => {
    it('builds an array of the desired length, filled with zeros', () => {
        const zarray = new ZeroArray(8);

        expect(zarray.length).toBe(8);
        zarray.forEach(val => {
            expect(val).toBe(0);
        });
    });
    it('is an array', () => {
        const zarray = new ZeroArray(8);
        expect(Array.isArray(zarray)).toBe(true);
    });
});
