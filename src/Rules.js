import * as util from './util';
import ShortId from 'shortid';

function isFilled(value) {
    return !util.isEmpty(value);
}

export function custom(validateFn, options) {
    return {
        id: ShortId.generate(), // makes this rule serializeable
        isAsync: false, // validate is expected to return a Promise. Validation rule will not run if other synchronous validation rules are failing
        message: "This field is invalid.", // {string|Function} message to display if input is not valid
        validate: validateFn,
        precondition: () => true, // {Function} if precondition fails, validation rule is not ran (not cached). Probably not needed if sync functions run first.
        dependsOn: [],
        isOptional: true, // don't run validation rule if _.isEqual(value,defaultValue)
        type: 'error', // "error" or "warning"
        compare: util.arrayCompare, // checks if the input args the same as last time and if so, returns the cached/memoized error message
        // todo: add throttle/debounce options
        ...options,
    }
}

export function async(validateFn, options) {
    return custom(validateFn, {isAsync: true, ...options});
}

export const required = custom(isFilled, {
    id: 'required',
    message: 'This field is required.',
    isOptional: false,
});

export function minLength(length, message = (value, length) => `Please enter at least ${length} characters (${length - value.length} more).`) {
    return custom(val => val.length >= length, {id: 'minLength', message: value => message(value, length)});
}

export function maxLength(length, message = (value, length) => `Please enter at most ${length} characters. You've entered ${value.length}.`) {
    return custom(val => val.length <= length, {id: 'maxLength', message: value => message(value, length)});
}

export const email = custom(value => /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i.test(value), {
    id: 'email',
    message: `Please enter a valid email address.`,
});

export function min(min, message = (value, min) => `Please enter a value greater than or equal to ${min}.`) {
    return custom(value => !isNaN(value) && value >= min, {id: 'min', message: value => message(value, min)});
}

export function max(max, message = (value, max) => `Please enter a value less than or equal to ${max}.`) {
    return custom(value => !isNaN(value) && value <= max, {id: 'max', message: value => message(value, max)});
}

export function range(min, max, message = (value, min, max) => `Please enter a value between ${min} and ${max} inclusive.`) {
    return custom(value => !isNaN(value) && value >= min && value <= max, {id: 'range', message: value => message(value, min, max)});
}

export function digits(message = (value) => `Please enter only digits.`) {
    return custom(value => /^\d+$/.test(value), {id: 'digits', message});
}

/**
 * @param {boolean} negative
 * @param message
 * @returns {{id, isAsync, message, validate, precondition, dependsOn, isOptional, type, compare}|*}
 */
export function realNumber(negative = false, message = (value) => `Please enter a valid number.`) {
    return custom(value => (!negative || value >= 0) && /^-?(?:(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d*)?|\.\d+)$/.test(value), {id: 'realNumber', message});
}

// TODO: add rest from https://jqueryvalidation.org/documentation/#link-list-of-built-in-validation-methods
