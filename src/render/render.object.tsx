import { useState } from "react";
import { useComponents } from "../hooks/use.component";
import { mapKeys } from "../utils/utils";
import { RenderDef } from "./simpleImpl/simple.renderers";
import { SimpleFormContainer } from "./simpleImpl/simple.form.container";

/**
 * Adjusted types to accept any provider type as a string.
 */
export type ObjectDef<T> = Partial<Record<keyof T, RenderDef>>;
export type TypeToObjectDef<T extends string> = Partial<Record<T, ObjectDef<any>>>;
export type ProviderToObjectDef<T extends string> = Partial<Record<string, TypeToObjectDef<T>>>;
export type RenderObjectProps<Type extends string, T> = {
    value?: T;
};

/**
 * Modified renderObject to accept useProviderType.
 */
export const renderObject = <Type extends string, T>(
    defns: ProviderToObjectDef<Type>,
    type: Type,
    useProviderType: () => string
) =>
    ({ value }: RenderObjectProps<Type, T>): JSX.Element => {
        const providerType = useProviderType();
        const [obj, setObj] = useState<Partial<T>>(value || {});
        const { Field } = useComponents(obj, setObj);

        const byProviderType = defns[providerType];
        if (!byProviderType)
            throw new Error(`No definition for provider type ${providerType}`);

        const defn: ObjectDef<T> | undefined = byProviderType[type];
        if (!defn)
            throw new Error(`No definition for type ${type} in provider type: ${providerType}`);

        return (
            <SimpleFormContainer>
                {mapKeys(defn, key => <Field id={key} renderer={defn[key]} />)}
            </SimpleFormContainer>
        );
    };

export type GenericData<T> = {
    defn: ObjectDef<T>;
    value?: T;
};

export const renderGenericObject = <T,>(prop: GenericData<T>) => {
    const { value, defn } = prop;

    // Initialize state with the provided values or as an empty object.
    const [obj, setObj] = useState<Partial<T>>(value || {});
    const { Field } = useComponents(obj, setObj); // Custom hook for managing fields.

    // Throw an error if no definitions are provided.
    if (!defn) {
        throw new Error(`No definitions provided for object`);
    }

    return (
        <SimpleFormContainer>
            {mapKeys(defn, (key) => {
                const rendererDef = defn[key];

                // If the renderer definition is a group, render nested fields.
                if (typeof rendererDef === 'object' && rendererDef.type === 'group') {
                    const nestedValue = obj[key] || {}; // Get the value for the nested object.

                    return (
                        <div key={String(key)}>
                            {renderGenericObject({
                                defn: rendererDef.defn,
                                value: nestedValue,
                            })}
                        </div>
                    );
                }
                // Render the field normally for non-nested definitions.
                return <Field key={String(key)} id={key} renderer={rendererDef} />;
            })}
        </SimpleFormContainer>
    );
};



