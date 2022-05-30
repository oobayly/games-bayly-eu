import { OperatorFunction, filter } from "rxjs";

/** Only omit values that are not null or undefined. */
const filterNonNullable = <T>(): OperatorFunction<T, NonNullable<T>> => {
  return filter((value: T): value is NonNullable<T> => {
    return value !== null && value !== undefined;
  });
}

export {
  filterNonNullable,
}
