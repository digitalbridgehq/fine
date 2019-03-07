import { Vector3D } from './Vector3D';

describe('Vector3D', () => {
    it('mag', () => {
        const vec = new Vector3D([1, 0, 0]);
        const expected = 1;
        const actual = vec.mag();

        expect(actual).toBe(expected);
    });
});
