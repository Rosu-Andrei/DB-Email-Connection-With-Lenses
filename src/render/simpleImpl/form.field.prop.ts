import {fieldInputs, GetRenderer, RenderDef} from "./simple.renderers";

export interface FormFieldProps<T> {
    fieldInputs: fieldInputs<T>
    getRenderer: GetRenderer
    renderInput: RenderDef
}
