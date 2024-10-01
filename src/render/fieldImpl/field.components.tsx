import {RenderDef} from "../simpleImpl/simple.renderers";


export type FieldComponentsProp<T> = {
    id: keyof T,
    renderer?: RenderDef
};


export type Field = <T, > (prop: FieldComponentsProp<T>) => JSX.Element;
/**
 * This represents essentially our custom hook
 */
export type FieldComponentsFn = <T, >(formData: T, setFormData: (t: T) => void) => Field