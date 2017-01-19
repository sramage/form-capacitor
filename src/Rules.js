const _ = require('lodash');
// const {Seq} = require('immutable');
// import {hasProp} from '../../functions';

const OK = true;

function isEmpty(value) {
    if(_.isString(value) || _.isArray(value)) {
        return !value.length;
    }
    if(value instanceof Map || value instanceof Set || value instanceof Seq) {
        return !value.size;
    }
    if(_.isPlainObject(value)) {
        return !_.size(value);
    }
    return !value;
}

function isFilled(value) {
    return !isEmpty(value);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.required = function required(value) {
    return isFilled(value) ? OK : 'This field is required.';
};

exports.optional = function optional(fn) {
    return (value, ...args) => isEmpty(value) ? OK : fn(value, ...args);
};

exports.minLength = function minLength(length) {
    return optional(value => value.length < length ? `Please enter at least ${length} characters.` : OK);
};

exports.maxLength = function maxLength(length) {
    return optional(value => value.length > length ? `Please enter at most ${length} characters.` : OK);
};

// TODO: add rest from https://jqueryvalidation.org/documentation/#link-list-of-built-in-validation-methods