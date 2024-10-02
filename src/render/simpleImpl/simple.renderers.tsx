import React from "react";
import {ObjectDef, renderGenericObject} from "../RenderObject";


/**
 * a custom type for the input fields that keep repeating
 */
export type fieldInputs<T, > = {
    id: keyof T,
    value: T,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}
/**
 * We create a type for the functions that render our input fields, regardless of the type.
 * So these type describes a function that takes fieldInputs type as a parameter
 * and returns a JSX.
 *
 * The way it is written, FieldRenderer isn't generic itself. That (<T> (... means
 * that we specify the type only when calling the function.
 */
export type FieldRenderer = <T, >(fieldInputs: fieldInputs<T>) => JSX.Element

/**
 * an implementation of FieldRenderer that renders a text input
 */
export const renderStringInput: FieldRenderer = <T,>(
    fieldInputs: fieldInputs<T>
) => {
    const { id, value, onChange } = fieldInputs;
    const inputValue = value[id as keyof typeof value] || '';
    return (
        <input
            type="text"
            id={id as string}
            name={id as string}
            value={value[id] as string}
            onChange={onChange}
        />
    );
};

/**
 * an implementation of FieldRenderer that renders a select input
 */
export const renderDropDown = (options: string[]): FieldRenderer => <T, >(
    fieldInputs: fieldInputs<T>
) => {
    const {id, value, onChange} = fieldInputs
    return (
        <select
            id={id as string}
            name={id as string}
            value={value[id] as string}
            onChange={onChange}
        >
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
    | { type: "dropdown"; options: string[] }
    | { type: "group"; defn: ObjectDef<any> };  // New type to handle nested objects

export type GetRenderer = (render: RenderDef) => FieldRenderer;

export const getRender = (renderDef: RenderDef) => {
    if (renderDef === "text") {
        return renderStringInput;
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