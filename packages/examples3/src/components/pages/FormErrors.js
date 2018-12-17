import {Fragment} from 'react';
import {Content} from '../bulma';
import {getValue} from '../../form-capacitor'

// see also: https://github.com/epoberezkin/ajv-errors#messages-for-keywords

export default function FormErrors(props) {
    return <Content><ul><ErrorItem {...props}/></ul></Content>
}

function ErrorItem({schema,errors,propName,title}) {
    if(!errors) return null;
    const innerErrors = getErrorList({schema,errors});
    if(!innerErrors || !innerErrors.length) return null;
    // console.log(innerErrors);
    
    return (
        <li>
            {title || schema.title || propName}
            <ul>{innerErrors}</ul>
        </li>
    )
}

function getErrorList({schema,errors,propName}) {
    const errorList = [];
    if(errors.has('type')) {
        const errType = errors.get('type');
        errorList.push(<li key="type">Must be {/^[aeiouy]/i.test(errType)?'an':'a'} <code>{errType}</code></li>)
    }
    switch(schema.type) {
        case 'object':
            const required = errors.get('required');
            if(required && required.length) {
                errorList.push(<li key="required">These properties are required:<ul>{required.map(p => <li key={p}><code>{p}</code></li>)}</ul></li>)
            }
            
            errorList.push(...Object.keys(schema.properties).map(propName => (
                <ErrorItem key={propName} schema={getValue(schema,['properties',propName])} errors={getValue(errors,['properties',propName])} propName={propName} />
            )));
            break;
        case 'array':
            const items = errors.get('items');
            if(items) {
                for(const [idx,val] of items.entries()) {
                    // console.log(idx,val,val.size);
                    errorList.push(<ErrorItem title={<Fragment>{schema.items.title} <sup>#</sup>{idx+1}</Fragment>} key={idx} schema={schema.items} errors={val}/>)
                }
                
                // const subErrors = Array.from(items.keys()).map(idx => <ErrorItem title={<Fragment>{schema.items.title} <sup>#</sup>{idx+1}</Fragment>} key={idx} schema={schema.items} errors={items.get(idx)}/>)
                // errorList.push(...subErrors);
                // console.log(items,items.get(items.get(0)));
                
                // const indexes = items.keys();
                // for(let idx of indexes) {
                //     console.log(idx);
                // }
            }
            // if(errors.has('items')) {
            //    
            //     for(let [idx, val] of errors.get('items')) {
            //         if(!val) {
            //             console.log(idx,val);
            //             continue;
            //         }
            //         // errorList.push(<ErrorItem title={<Fragment>{schema.items.title} <sup>#</sup>{idx+1}</Fragment>} key={idx} schema={schema.items} errors={val}/>);
            //     }
            // }
            break;
        case 'number':
        case 'integer':
            if(errors.has('minimum')) {
                if(errors.has('exclusiveMinimum')) {
                    errorList.push(<li key="exclusiveMinimum">Must be greater than {errors.get('minimum')}</li>)
                } else {
                    errorList.push(<li key="minimum">Must be at least {errors.get('minimum')}</li>)
                }
            }
            if(errors.has('maximum')) {
                if(errors.has('exclusiveMaximum')) {
                    errorList.push(<li key="exclusiveMaximum">Must be less than {errors.get('maximum')}</li>)
                } else {
                    errorList.push(<li key="maximum">Must be at most {errors.get('maximum')}</li>)
                }
            }
            break;
        case 'string':
            if(errors.has('minLength')) {
                errorList.push(<li key="minLength">Must be at least {errors.get('minLength')} characters</li>)
            }
            if(errors.has('maxLength')) {
                errorList.push(<li key="maxLength">Must be at most {errors.get('maxLength')} characters</li>)
            }
            break;
    }

    return errorList;
}

function wrapLi(errors) {
    return errors && errors.length ? errors.map((x,i) => <li key={i}>{x}</li>) : null;
}