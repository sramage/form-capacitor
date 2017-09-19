import {compose, ComponentEnhancer} from 'recompose';
import {AnyObject, DispatchFn} from '../types/misc';
import withHandler, {EventHandler} from './withHandler';
import {defaultSerialize,defaultDeserializeField} from '../util';
import withValue from './withValue';

export interface ConnectOptions {
    nameProp?: string,
    valueProp?: string,
    setValueProp?: string,
    eventName?: string,
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
                                                    setValueProp = 'setValue',
                                                    eventName = 'onChange',
                                                    pathProp = 'path',
                                                    deserializeValue = defaultDeserializeField, // fixme: this default breaks complex inputs. should just return the value as-is
                                                    serializeValue = defaultSerialize,
                                                    eventHandler,
                                                }: ConnectOptions = {}): ComponentEnhancer<TProps, TProps & ConnectProps> {


    let hocs = [
        withValue({nameProp, valueProp, setValueProp, deserializeValue, serializeValue, pathProp}),
        // mountPoint(p => p[nameProp]),
    ];

    if (eventHandler) {
        hocs.push(withHandler({event: eventName, handler: eventHandler}));
    }

    return compose(...hocs);
}
