import React from 'react';
import { getRender, RenderDef } from './simpleImpl/simple.renderers';
import { LensWithPath } from '../utils/lens';
import { SetValueEvent } from '../events/events';
import { useStateOps } from '../context/state.context';
import { buildPath } from "../utils/utils";

interface FieldWithLensProps {
    renderer: RenderDef;
    lens: LensWithPath<any, any>;
}

export const FieldWithLens = ({ renderer, lens }: FieldWithLensProps) => {
    const { state, handleEvent } = useStateOps<any>();
    const fieldValue = lens.get(state);
    const value = fieldValue !== undefined && fieldValue !== null ? fieldValue : '';
    const handleChange = (newValue: any) => {
        const event: SetValueEvent = {
            event: 'setValue',
            path: buildPath(...lens.path),
            value: newValue,
        };

        handleEvent(event);
    };

    const fieldRenderer = getRender(renderer);
    const idString = lens.path[lens.path.length - 1];

    // Adjust the label to exclude unwanted parts
    const formDataIndex = lens.path.indexOf('formData');
    const relevantPath = formDataIndex >= 0 ? lens.path.slice(formDataIndex + 1) : lens.path;
    const labelText = relevantPath.join('.');

    const fieldInputs = {
        id: idString,
        value: { [idString]: value },
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            let newValue: any = e.target.value;
            if (renderer === 'number') {
                newValue = e.target.value !== '' ? parseFloat(e.target.value) : undefined;
            }
            handleChange(newValue);
        },
        path: buildPath(...lens.path),
    };

    return (
        <div>
            <label>{labelText}</label>
            {fieldRenderer(fieldInputs)}
        </div>
    );
};
