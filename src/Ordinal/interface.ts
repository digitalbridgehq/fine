export interface IOrdinal {
    equal(right: IOrdinal): boolean;
    greaterThan(right: IOrdinal): boolean;
}
