import createComponent from '../../createComponent';
import {withValue} from 'form-capacitor-state';
import {mapProps,omitProps,withProps,withPropsOnChange,defaultProps} from 'recompact';
// import dump from 'form-capacitor-util/dump';

// console.log(withValue);

export default createComponent({
    displayName: 'TextBox',
    enhancers: [
        withValue({
            valueProp: 'value',
            setValueProp: 'setValue',
        }),
        withPropsOnChange('setValue', ({setValue}) => ({
            onChange(ev) {
                setValue(ev.currentTarget.value);
            }
        })),
        defaultProps({
            value: '', // prevents uncontrolled -> controlled warning
        }),
        omitProps(['name','setValue']),
    ],
    render: props => (
        <div className="control">
            <input className="input" {...props}/>
        </div>
    )
})