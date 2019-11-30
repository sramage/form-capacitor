import FormContext from './FormContext';
import {toPath} from './helpers';
import {useObserver} from "mobx-react-lite";
import {useContext} from "react";
import {getErrors} from "./errorMapping";

/**
 * Returns the stored value for this component and a function to set the value
 * @param {string | string[]} path
 * @returns {[Boolean, Array | null]}
 */
export default function useConsumeArrayErrors(path) {
    const context = useContext(FormContext);
    const fullPath = [...context.path, ...toPath(path)];
    const errors = getErrors(context.errorMap, fullPath);
    // console.log(fullPath, context.errorMap, errors);
    return useObserver(() => [errors && errors.length > 0, errors]);
};