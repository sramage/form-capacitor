import {compose, ComponentEnhancer} from 'recompose';
import {connect as connectRedux} from 'react-redux';
import namespace from '../namespace';
import ActionTypes from '../ActionTypes';
import getOr from 'lodash/fp/getOr';
import {toPath} from 'lodash';
import {getPath, FIELD_PATH} from '../context';
import mountPoint from './mountPoint';
import {AnyObject, DispatchFn} from '../types/misc';
import withContext from './withContext';
import memoize from '../memoize';
import withValueDispatch from './withValueDispatch';
import {ReactEventHandler} from 'react';
import withHandler, {EventHandler} from './withHandler';
import {defaultSerialize,defaultDeserialize} from '../util';

export interface ConnectOptions {
    nameProp?: string,
    valueProp?: string,
    dispatchProp?: string,
    changeProp?: string,
    eventHandler?: EventHandler,
    deserializeValue?: (value: any) => any,
    serializeValue?: (value: any) => any,
    /**
     * Don't pass the `name` property to the wrapped component.
     * Usually it's not needed in the HTML because it's tracked by form-capacitor,
     * but it might be useful for debugging or `<input type="radio" />`.
     */
    removeName?: boolean,
}

export interface ConnectProps {
    name: string,
    value: any,
    dispatch: DispatchFn
}

export default function field<TProps=AnyObject>({
                                                    nameProp = 'name',
                                                    valueProp = 'value',
                                                    dispatchProp = 'dispatch',
                                                    changeProp = 'onChange',
                                                    deserializeValue = defaultDeserialize,
                                                    serializeValue = defaultSerialize,
                                                    eventHandler,
                                                    removeName = true,
                                                }: ConnectOptions = {}): ComponentEnhancer<TProps, TProps & ConnectProps> {


    let hocs = [
        withValueDispatch({nameProp, valueProp, dispatchProp, deserializeValue, serializeValue, removeName}),
        mountPoint(p => p[nameProp]),
    ];

    if (eventHandler) {
        hocs.push(withHandler(changeProp, eventHandler));
    }

    return compose(...hocs);
}
