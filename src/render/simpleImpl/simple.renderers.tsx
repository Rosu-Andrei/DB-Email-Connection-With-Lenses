import React from "react";
import {ObjectDef, renderGenericObject} from "../render.object";
import {useStateOps} from "../../context/state.context";
import {lensFromPath} from "../../utils/lens";


/**
 * a custom type for the input fields that keep repeating
 */
export type fieldInputs<T> = {
    id: keyof T,
    value: T,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void,
    path: string
}
/**
 * We create a type for the functions that render our input fields, regardless of the type.
 * So these type describes a function that takes fieldInputs type as a parameter
 * and returns a JSX.
 *
 * The way it is written, FieldRenderer isn't generic itself. That (<T> (... means
 * that we specify the type only when calling the function.
 */
export type FieldRenderer = <T>(fieldInputs: fieldInputs<T>) => JSX.Element

/**
 * an implementation of FieldRenderer that renders a text input
 */
export const renderStringInput: FieldRenderer = <T,>(
    { id, onChange, path }: fieldInputs<T>
) => {
    const { state } = useStateOps<T>()
    const lens = lensFromPath<T>(path)
    let initialState = lens.get(state);
    const [text, setText] = React.useState(initialState);
    return (
        <input
            type="text"
            id={id as string}
            name={id as string}
            value={text}
            onChange={e => setText(e.target.value)}
            onBlur={onChange}
            onKeyDown={e => {
                if (e.key === "Enter") {
                    onChange({
                        target: {
                            value: (e.target as HTMLInputElement).value,
                            name: id as string
                        }
                    } as unknown as React.ChangeEvent<HTMLInputElement>);
                }
            }}
        />
    );
};

/**
 * An implementation of FieldRenderer that renders a number input
 */
export const renderNumberInput: FieldRenderer = <T,>(
    fieldInputs: fieldInputs<T>
) => {
    const { id, onChange, path } = fieldInputs;
    const { state } = useStateOps<T>()
    const lens = lensFromPath<T>(path)
    let initialState = lens.get(state);
    const [text, setText] = React.useState(initialState);
    return (
        <input
            type="number"
            id={id as string}
            name={id as string}
            value={text}
            onChange={e => setText(e.target.value)}
            onBlur={onChange}
            onKeyDown={e => {
                if (e.key === "Enter") {
                    onChange({
                        target: {
                            value: (e.target as HTMLInputElement).value,
                            name: id as string
                        }
                    } as unknown as React.ChangeEvent<HTMLInputElement>);
                }
            }}
        />
    );
};

/**
 * An implementation of FieldRenderer that renders a password input
 */

export const renderPasswordInput: FieldRenderer = <T,>(
    fieldInputs: fieldInputs<T>
) => {
    const { id, onChange, path } = fieldInputs;
    const { state } = useStateOps<T>()
    const lens = lensFromPath<T>(path)
    let initialState = lens.get(state);
    const [text, setText] = React.useState(initialState);
    return (
        <input
            type="password"
            id={id as string}
            name={id as string}
            value={text}
            onChange={e => setText(e.target.value)}
            onBlur={onChange}
            onKeyDown={e => {
                if (e.key === "Enter") {
                    onChange({
                        target: {
                            value: (e.target as HTMLInputElement).value,
                            name: id as string
                        }
                    } as unknown as React.ChangeEvent<HTMLInputElement>);
                }
            }}
        />
    );
};

/**
 * an implementation of FieldRenderer that renders a select input
 */
export const renderDropDown = (options: string[]): FieldRenderer => <T, >(
    fieldInputs: fieldInputs<T>
) => {
    const { id, value, onChange } = fieldInputs
    return (
        <select
            id={id as string}
            name={id as string}
            value={value[id] as string}
            onChange={onChange}>
            <option value="">Select value</option>
            {options.map((option, index) => (
                <option key={index} value={option}>
                    {option}
                </option>
            ))}
        </select>
    )
}

/**
 * The following 2 types are added compared to cut2 for making the code much
 * cleaner for once but also to introduce the concept of data driven in our code.
 */
export type RenderDef =
    | "text"
    | "number"
    | "password"
    | { type: "dropdown"; options: string[] }
    | { type: "group"; defn: ObjectDef<any> };  // New type to handle nested objects


export type GetRenderer = (render: RenderDef) => FieldRenderer;

export const getRender = (renderDef: RenderDef) => {
    if (renderDef === "text") {
        return renderStringInput;
    }
    if (renderDef === "number") {
        return renderNumberInput;
    }
    if (renderDef === "password") {
        return renderPasswordInput;
    }

    if (typeof renderDef === "object") {
        if (renderDef.type === "dropdown") {
            return renderDropDown(renderDef.options);
        } else if (renderDef.type === "group") {
            // If the render type is a 'group', return a nested object renderer
            return <T, >(fieldInputs: fieldInputs<T>) => {
                const {value, id} = fieldInputs;

                // This ensures that if the value is undefined, it starts as an empty object to avoid rendering issues.
                const nestedValue = value[id] || {};

                // Render the nested object fields using `renderGenericObject` for nested groups
                return renderGenericObject({
                    defn: renderDef.defn,
                    value: nestedValue,
                });
            };
        }
    }

    throw new Error("Unsupported RenderDef type");
};