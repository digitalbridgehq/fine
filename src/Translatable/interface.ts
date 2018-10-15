import { IVector } from '../Vector';

export interface ITranslatable<T> {
    translate(vec: IVector): T;
}