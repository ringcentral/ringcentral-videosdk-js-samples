export function isObject(value): boolean {
    return Object.prototype.toString.call(value) === '[object Object]';
}
export const deepmerge = (...objects) =>
    objects.reduce((result, current) => {
        if (Array.isArray(current)) {
            throw new TypeError('Arguments provided to deepmerge must be objects, not arrays.');
        }
        Object.keys(current).forEach(key => {
            if (['__proto__', 'constructor', 'prototype'].includes(key)) {
                return;
            }
            if (Array.isArray(result[key]) && Array.isArray(current[key])) {
                result[key] = Array.from(new Set((result[key] as unknown[]).concat(current[key])));
            } else if (isObject(result[key]) && isObject(current[key])) {
                result[key] = deepmerge(result[key], current[key]);
            } else {
                result[key] = current[key];
            }
        });
        return result;
    }, {});
