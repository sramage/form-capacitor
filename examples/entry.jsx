const ReactDOM = require('react-dom');
const Form1 = require('./Form1');
const Form2 = require('./Form2');
const FormStoreProvider = require('form-capacitor/FormStoreProvider');

const initialState = {
    form1: {
        data: {
            email: "mpenner@nucleuslabs.com",
        }
    }
};

ReactDOM.render(
    <FormStoreProvider initialState={initialState}>
        <div className="container">
            <h1>Form Capacitor Example</h1>
            <div className="row">
                <div className="col-6">
                    <h2>Form 1</h2>
                    <Form1 id="form1"/>
                </div>
                <div className="col-6">
                    <h2>Form 2</h2>
                    <Form2 id="form2"/>
                </div>
            </div>
        </div>
    </FormStoreProvider>, 
    document.getElementById('react-root')
);