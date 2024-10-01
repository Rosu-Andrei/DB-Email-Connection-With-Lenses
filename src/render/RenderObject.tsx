import {useState} from "react";
import {useComponents} from "../hooks/use.component";
import {mapKeys} from "../utils/utils";
import {RenderDef} from "./simpleImpl/simple.renderers";
import {SimpleFormContainer} from "./simpleImpl/simple.form.container";
import {DatabaseType, useDbType} from "./dbType/dbType";


/**
 * These type is used to map each key of an interface / structure that we pass,
 * like Name or Address to a type of RenderDef, in our case ("text", or {type: "dropdown", options:Options[]}
 */
export type ObjectDef<T> = Partial<Record<keyof T, RenderDef>>;
/**
 * This type works hand in hand with the ValidTypes defined in cut4 that can be as value either
 * 'name' or 'address'. These type has a map of the ValidType to the key of either Name and Address at which
 * they in turn point to a RenderDef
 */
export type TypeToObjectDef<T extends string> = Record<T, ObjectDef<any>>;
/**
 * The same idea as before, but these ony uses as keys the Country (custom type that accepts
 * 'uk', 'ch' or 'cn' at the moment
 */
export type DatabaseToObjectDef<T extends string> = Partial<Record<DatabaseType, TypeToObjectDef<T>>>
/**
 * From what I understand these fucker is used to provide the initial state to the
 * useState hook (if there is any)
 */
export type RenderObjectProps<Type extends string, T> = {
    value?: T;
}
/**
 * this one is responsible for bringing everything together. It's a high order function (the first function,
 * which has the name renderObject, return another function, and the second function is responsible for
 * rendering the JSX element
 */
export const renderObject = <Type extends string, T>(defns: DatabaseToObjectDef<Type>, type: Type) =>
    ({value}: RenderObjectProps<Type, T>): JSX.Element => {
        /**
         * Get the current country from context (if there is none given, uses the default
         * , countries[0] aka 'uk'
         */
        const dbType = useDbType();
        /**
         * the form data, returned from the useState hook.
         * The initial data is either the value parsed or empty object otherwise
         */
        const [obj, setObj] = useState<Partial<T>>(value || {});
        /**
         * Using the custom hook useComponents from cut3, we return the Field function
         */
        const {Field} = useComponents(obj, setObj);
        /**
         * because we know that the key to the defns is a country type, we can
         * get its value by  using the country as an index.
         * The value is of type TypeToObjectDefn
         */
        const byDatabaseType = defns[dbType];
        if (!byDatabaseType)
            throw new Error(`No definition for country ${byDatabaseType}`);
        /**
         * we give a type as a parameter to the function call. We consider this type to have the possible
         * values of ValidTypes ('name' or 'address'). Based on it as a key for TypeToObjectDef,
         * we extract the value, that ObjectDef
         */
        const defn: ObjectDef<T> = byDatabaseType[type]; // Get definitions for the specified type
        if (!defn)
            throw new Error(`No definition for type ${type} in database of type: ${byDatabaseType}`);

        return (
            <SimpleFormContainer>
                {mapKeys(defn, key => <Field id={key} renderer={defn[key]}/>)}
            </SimpleFormContainer>
        )
    };

export type GenericData<T, > = {
    defn: ObjectDef<T>;
    value?: T
}

export const renderGenericObject = <T, >(prop: GenericData<T>) => {
    const {value, defn} = prop;

    // Initialize state with the provided values or as an empty object.
    const [obj, setObj] = useState<Partial<T>>(value || {});
    const {Field} = useComponents(obj, setObj); // Custom hook for managing fields.

    // Throw an error if no definitions are provided.
    if (!defn) {
        throw new Error(`No definitions provided for object`);
    }

    return (
        <SimpleFormContainer>
            {mapKeys(defn, (key) => {
                const rendererDef = defn[key];

                // If the renderer definition is a group, render nested fields.
                if (typeof rendererDef === 'object' && rendererDef.type === "group") {
                    const nestedValue = obj[key] || {}; // Get the value for the nested object.

                    return (
                        <div>
                            {renderGenericObject({
                                defn: rendererDef.defn,
                                value: nestedValue,
                            })}
                        </div>
                    );
                }
                // Render the field normally for non-nested definitions.
                return (
                    <Field id={key} renderer={rendererDef}/>
                );

            })}
        </SimpleFormContainer>
    );
};

/*export const renderGenericObjectWithLens = <T, >(prop: GenericData<T>, lens: LensAndPath<T, any>) => {
    const {value, defn} = prop;
    const [obj, setObj] = useState<Partial<T>>(value || {});
    const {Field} = useComponents(obj, setObj);

    if (!defn) {
        throw new Error(`No definitions provided for object`);
    }

    return (
        <SimpleFormContainer>
            {mapKeys(defn, (key) => {
                const rendererDef = defn[key];
                const focusedLens = lens.focusOn(key); // Use the lens to focus on the current property

                if (typeof rendererDef === 'object' && rendererDef.type === "group") {
                    const nestedValue = focusedLens.get(obj); // Get the value for the nested object
                    return (
                        <div>
                            {renderGenericObjectWithLens({
                                defn: rendererDef.defn,
                                value: nestedValue,
                            }, focusedLens)}
                        </div>
                    );
                }

                return (
                    <Field
                        id={key}
                        renderer={rendererDef}
                        value={focusedLens.get(obj)} // Get the value using the lens
                        onChange={(newValue) => {
                            setObj(focusedLens.set(obj, newValue)); // Set the new value using the lens
                        }}
                    />
                );
            })}
        </SimpleFormContainer>
    );
};*/


