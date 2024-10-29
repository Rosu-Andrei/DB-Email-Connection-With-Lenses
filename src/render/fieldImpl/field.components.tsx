import {RenderDef} from "../simpleImpl/simple.renderers";

export type FieldComponentsProp<T> = {
    id: keyof T,
    renderer?: RenderDef
};
