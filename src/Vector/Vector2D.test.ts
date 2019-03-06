import { Vector2D } from './Vector2D';

describe('Vector2D', () => {
    it('mag', () => {
        const vec = new Vector2D([1, 0]);
        const expected = 1;
        const actual = vec.mag();

        expect(actual).toBe(expected);
    });
});
