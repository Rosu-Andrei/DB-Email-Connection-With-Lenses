import {FormFieldProps} from "./form.field.prop";

export const SimpleFormField = <T, >(props: FormFieldProps<T>) => {

    const {fieldInputs, getRenderer, renderInput} = props;

    return (
        <div>
            <label htmlFor={fieldInputs.id as string}>{fieldInputs.id as string}</label>
            {getRenderer(renderInput)(fieldInputs)}
        </div>
    )
}