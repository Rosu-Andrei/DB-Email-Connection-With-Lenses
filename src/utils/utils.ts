/**
 * The function mapKeys takes an object obj and applies a transformation function fn
 * to each key of the object, returning an array of the results from calling fn on each key.
 *
 * the bound states that T extends object, so T will be an object, if we give
 * a primitive like a number or a string, a compilation error will be thrown.
 */
export function mapKeys<T extends object, T1>(obj: T,
                                              fn: (key: keyof T) => T1): T1[] {
    /**
     * First, Object.keys() will create a string[] of the keys of the object given as parameter.
     * After that, we use the map function that takes each key from the newly array and we apply the fn function to it
     */
    return Object.keys(obj).map((key) => fn(key as keyof T));
}