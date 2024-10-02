import React from 'react';
import { getRender, RenderDef } from "./simpleImpl/simple.renderers";
import { LensAndPath } from "../utils/lens";

interface FieldWithLensProps<T> {
    id: keyof T; // path[] of the lens
    renderer: RenderDef;
    lens: LensAndPath<T, any>;
    obj: any;
    setObj: (o: any) => void;
}

export const FieldWithLens = <T,>(props: FieldWithLensProps<T>) => {
    const { id, renderer, lens, obj, setObj } = props;
    const fieldValue = lens.get(obj);
    const handleChange = (newValue: any) => {
        const updatedObj = lens.set(obj, newValue);
        setObj(updatedObj);
    };

    const fieldRenderer = getRender(renderer);
    const idString = lens.path[lens.path.length - 1];
    const fieldInputs = {
        id: idString,
        value: { [idString]: fieldValue },
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            let newValue: any = e.target.value;
            if (renderer === "number") {
                newValue = e.target.value !== '' ? parseFloat(e.target.value) : undefined;
            }
            handleChange(newValue);
        },
    };

    return (
        <div>
            <label>{lens.path.join('.')}</label>
            {fieldRenderer(fieldInputs)}
        </div>
    );
};
