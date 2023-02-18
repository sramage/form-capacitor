import FormContext from './FormContext';
import {extractMuiProps, getValue, toPath} from './helpers';
// import {useObserver} from "mobx-react-lite";
import {useContext, useEffect, useState} from "react";
import {pathToPatchString} from "./validation";
import {getErrors} from "./errorMapping";
import {autorun} from "mobx";

/**
 * Returns the stored value for the provided path in relation to the current FormContext path and a function to set the value
 * @param {string | string[]} path
 * @returns {{}}
 */
export default function useMaterialUiField(path) {
    const context = useContext(FormContext);
    const fullPath = [...context.path, ...toPath(path)];
    const patchPath = pathToPatchString(fullPath);
    const onChange = (event) => {
        context.set(fullPath, event.target.value || undefined);
    };

    // return useObserver(() => {
    //     return {
    //         ...extractMuiProps(context, patchPath, getErrors(context.errorMap, fullPath)),
    //         value: getValue(context.stateTree, fullPath, undefined),
    //         onChange
    //     };
    // });

    // React18/mobx6: useObserver() is deprecated, and tbqh, none of the API in mobx-react-lite looks like its meant for providing a custom hook in this manner.
    // Replaced with a custom hook leaning on useState, useEffect, and autorun() straight from mobx
    const [value, setValue] = useState(getValue(context.stateTree, fullPath, undefined));
    const [muiProps, setMuiProps] = useState(extractMuiProps(context, patchPath, getErrors(context.errorMap, fullPath)));

    useEffect(() => {
        autorun(() => {
            setValue(getValue(context.stateTree, fullPath, undefined));
        });
    }, [context.stateTree[fullPath]]);

    useEffect(() => {
        autorun(() => {
            setMuiProps(extractMuiProps(context, patchPath, getErrors(context.errorMap, fullPath)));
        });
    }, [context.fieldMetaDataMap[patchPath]]);

    return {
        ...muiProps,
        value: value,
        onChange
    };
};