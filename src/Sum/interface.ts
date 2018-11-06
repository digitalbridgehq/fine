import { FineResult } from '../interface';

export interface ISum<T> {
  /**
   * produce a sum of the left and right operands
   */
  sum: (right: T) => FineResult<string, T>;
}
