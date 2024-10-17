import React from 'react';
import { getRender, RenderDef } from './simpleImpl/simple.renderers';
import { LensAndPath } from '../utils/lens';
import {SetValueEvent, Event} from "../events/events";

interface FieldWithLensProps<T> {
    id: keyof T; // path[] of the lens
    renderer: RenderDef;
    lens: LensAndPath<any, any>;
    obj: any;
    handleEvent: (event: Event) => void;
}

export const FieldWithLens = <T,>({
                                      id,
                                      renderer,
                                      lens,
                                      obj,
                                      handleEvent,
                                  }: FieldWithLensProps<T>) => {
    const fieldValue = lens.get(obj);
    const handleChange = (newValue: any) => {
        const event: SetValueEvent = {
            event: 'setValue',
            path: lens.path.join('.'),
            connectionId: obj.id,
            value: newValue,
            fieldName: obj.fieldName,
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
        value: { [idString]: fieldValue },
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            let newValue: any = e.target.value;
            if (renderer === 'number') {
                newValue = e.target.value !== '' ? parseFloat(e.target.value) : undefined;
            }
            handleChange(newValue);
        },
    };

    return (
        <div>
            <label>{labelText}</label>
            {fieldRenderer(fieldInputs)}
        </div>
    );
};
