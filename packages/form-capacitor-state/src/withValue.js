import React from 'react';
import {createEagerFactory, wrapDisplayName, shallowEqual} from 'recompact';
import {CTX_KEY_PATH, CTX_VAL_PATH, DATA_ROOT, store} from 'form-capacitor-store';
import {resolveValue} from '../../form-capacitor-util/util';


export default function withValue(options) {

    options = {
        path: p => p.path,
        clearOnUnmount: false,
        defaultValue: undefined,
        selfUpdate: true,
        
        // output props:
        valueProp: undefined,
        setValueProp: undefined,
        // pathProp: undefined,
        
        ...options,
    };

    
    return BaseComponent => {
        class WithValue extends React.Component {

            constructor(props) {
                super(props);
                const path = resolveValue(options.path, props);
                if(!path) {
                    throw new Error("Missing `path`");
                }
                this.fullPath = [DATA_ROOT, ...path];

                let currentValue = store.get(this.fullPath);

                if(options.defaultValue !== undefined && currentValue === undefined) {
                    // not entirely sure if we want to support this feature yet
                    store.set(this.fullPath, options.defaultValue);
                    currentValue = options.defaultValue;
                }

                // console.log('currentValue',currentValue);

                if(options.valueProp) {
                    this.state = {
                        value: currentValue
                    }
                }
            }

            setValue = value => {
                // console.log(selfUpdate);
                store.set(this.fullPath, value, !options.selfUpdate && this.unsub ? this.unsub.key : null);
            };

            componentWillMount() {
                if(options.valueProp) {
                    this.unsub = store.subscribe(this.fullPath, value => {
                        // console.log(BaseComponent.displayName,'got change',getValue(this.store, this.fullPath));
                        // console.log('change',this.fullPath);
                        this.setState({value});
                    });
                }
            }

            componentWillUnmount() {
                if(options.valueProp) {
                    this.unsub();
                }
                if(options.clearOnUnmount) {
                    store.unset(this.fullPath);
                }
            }
            
            render() {
                let props = {
                    ...this.props,
                };
                if(options.valueProp) {
                    props[options.valueProp] = this.state.value;
                    // console.log('this.state',this.state);
                    // console.log('props[valueProp]',props[valueProp]);
                }
                if(options.setValueProp) {
                    props[options.setValueProp] = this.setValue;
                }
             
                
                return React.createElement(BaseComponent, props);
            }
        };

        if(process.env.NODE_ENV !== 'production') {
            WithValue.displayName = wrapDisplayName(BaseComponent, 'withValue');
        }

        return WithValue;
    }
};
