import {InputText} from '../bulma';
import connect from '../../form-capacitor/connect';
import {action} from 'mobx';

@connect({
    propName: 'value',
    defaultValue: p => p.defaultValue !== undefined ? p.defaultValue : '',
    mountPoint: p => p.name,
})
export default class TextBox extends React.Component {

    @action.bound
    handleChange(ev) {
        this.props.value.set(ev.target.value);
        if(this.props.onChange) {
            this.props.onChange(ev)
        }
    }
    
    render() {
        const {value, name, defaultValue, ...props} = this.props;
        return <InputText {...props} value={value.get()} onChange={this.handleChange}/>
    }
}