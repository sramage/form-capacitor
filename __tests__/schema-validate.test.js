import {default as schema} from '../src/schema';
import {default as consumeValue} from '../src/consume';
import {errorMapToFlatArray} from "../src";
import * as React from "react";
import jsonSchema from "./demo-form.json";
import {render, fireEvent, wait, cleanup} from "react-testing-library";
import {toJS} from "mobx";

@consumeValue()
class SimpleTextBox extends React.Component {
    handleChange = ev => {
        this.props.fc.set(ev.target.value || undefined);
    };

    render() {
        const {fc, value, ...props} = this.props;
        return <input type="text" {...props} className={fc.hasErrors ? "error" : null} value={value || ""} onChange={this.handleChange}/>;
    }
}

@schema({
    schema: jsonSchema,
    $ref: "#/definitions/DemoForm",
    default: {
        lastName: "Bar",
        alias: []
    },
    actions: formData => ({
        addAlias(alias) {
            formData.alias.push({alias: alias});
        },
        clearAliases() {
            formData.alias.length = 0;
        },
        spliceAlias(idx) {
            formData.alias.splice(idx, 1);
        },
    }),
})
class DemoForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            valid: 'Unknown',
            errors: []
        };
    }
    render() {
        if(!this.props.formData){
            return null;
        }
        const {formData} = this.props;
        return (
            <div>
                <div>
                    <span>First Name</span>
                    <SimpleTextBox data-testid="firstName" name="firstName"/>
                </div>
                <div>
                    <span>Last Name</span>
                    <SimpleTextBox data-testid="lastName" name="lastName"/>
                </div>
                <ul data-testid="alias">
                    {formData.alias.map((obj,idx)=> <li key={idx}>{obj.alias}</li>)}
                </ul>
                <div>
                    <button data-testid="bfn" onClick={() => formData.set("firstName", "Joe")}>Set First Name</button>
                    <button data-testid="bln" onClick={() => formData.set("lastName", "Dirt")}>Set Last Name</button>
                    <button data-testid="v" onClick={() => {
                        if(this.props.validate()) {
                            this.setState({valid: "VALID", errors: []});
                        } else {
                            this.setState({valid: "INVALID", errors: toJS(errorMapToFlatArray(this.props.errorMap))});
                        }
                    }}>Validate</button>
                </div>
                <div data-testid="valid">{this.state.valid}</div>
                <div data-testid="errors">{this.state.errors && this.state.errors.map(e => <div>{e.message}</div>)}</div>
            </div>
        );
    }
}

afterEach(cleanup);

test("The imperative schema validation function should behave itself", async () => {
    let {getByTestId} = render(<DemoForm/>);
    await wait(() => getByTestId("lastName"));
    const buttonV = getByTestId("v");
    const valid  = getByTestId("valid");
    const errors  = getByTestId("errors");
    expect(valid.innerHTML).toBe('Unknown');
    fireEvent.click(buttonV);
    expect(valid.innerHTML).toBe('INVALID');

    const inputFN = getByTestId("firstName");
    expect(inputFN.value).toBe('');
    const buttonFN = getByTestId("bfn");
    fireEvent.click(buttonFN);
    expect(inputFN.value).toBe('Joe');

    const buttonLN = getByTestId("bln");
    fireEvent.click(buttonLN);
    expect(inputFN.value).toBe('Joe');
    const inputLN = getByTestId("lastName");
    expect(inputLN.value).toBe('Dirt');

    const aliasUl = getByTestId("alias");
    expect(aliasUl.childNodes.length).toBe(0);
    fireEvent.click(buttonV);
    expect(errors.innerHTML).toBe('');
    expect(valid.innerHTML).toBe('VALID');
});
