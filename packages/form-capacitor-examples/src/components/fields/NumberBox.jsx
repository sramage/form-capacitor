import createComponent from '../../createComponent';
import {withValue} from 'form-capacitor-state';
import {mapProps,omitProps,withProps,withPropsOnChange,defaultProps} from 'recompact';
// import dump from 'form-capacitor-util/dump';

// console.log(withValue);

export default createComponent({
    displayName: 'NumberBox',
    enhancers: [
        withValue({
            valueProp: 'value',
            setValueProp: 'setValue',
        }),
        withPropsOnChange('setValue', ({setValue}) => ({
            onChange(ev) {
                const value = ev.currentTarget.valueAsNumber;
                setValue(Number.isFinite(value) ? value : null);
            }
        })),
        withPropsOnChange('value',({value}) => ({value: Number.isFinite(value) ? String(value) : ''})),
        omitProps(['name','setValue']),
    ],
    render: props => (
        <div className="control">
            <input className="input" type="number" {...props}/>
        </div>
    )
})