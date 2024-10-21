import React, { useEffect } from 'react';
import { LensWithPath, LensBuilder } from '../utils/lens';
import { dbDef, ConnectionDef, emailDef } from '../utils/component.prop';
import { FormWithArray } from './FormWithArray';
import { Event, SetValueEvent } from "../events/events";

type ConnectionComponentProps<S> = {
    index: number;
    id: string;
    s: S;
    handleEvent: (event: Event) => void;
    lens: LensWithPath<S, any>;
    removeConnection: (id: string) => void;
};

export function ConnectionComponent<S>({
                                           index,
                                           id,
                                           s,
                                           lens,
                                           handleEvent,
                                           removeConnection,
                                       }: ConnectionComponentProps<S>) {
    // Use LensBuilder to create lenses
    const lensBuilder = new LensBuilder(lens);
    const connectionTypeLens = lensBuilder.focuson('connectionType').build();
    const selectedTypeLens = lensBuilder.focuson('selectedType').build();
    const dynamicPropsLens = lensBuilder.focuson('dynamicProps').build();
    const formDataLens = lensBuilder.focuson('formData').build();

    const connectionType = connectionTypeLens.get(s) || 'db';
    const selectedType = selectedTypeLens.get(s) || '';
    const dynamicProps = dynamicPropsLens.get(s) || [];

    // Update functions
    const updateConnectionType = (value: 'db' | 'email') => {
        // Create a new connection object with updated values
        const defs = value === 'db' ? dbDef : emailDef;
        const initialSelectedType = defs[0].name.toLowerCase();
        const def = defs.find((d) => d.name.toLowerCase() === initialSelectedType);

        const updatedConnection = {
            connectionType: value,
            selectedType: initialSelectedType,
            dynamicProps: def ? def.render : [],
            formData: {},
        };

        const event: SetValueEvent = {
            event: 'setValue',
            path: `connections.${index}`,
            value: updatedConnection,
        };

        handleEvent(event);
    };

    const updateSelectedType = (value: string, defs: ConnectionDef[]) => {
        const def = defs.find((d) => d.name.toLowerCase() === value);

        const updatedConnection = {
            selectedType: value,
            dynamicProps: def ? def.render : [],
            formData: {},
        };

        const event: SetValueEvent = {
            event: 'setValue',
            path: `connections.${index}`,
            value: updatedConnection,
        };

        handleEvent(event);
    };

    // useEffect to set default selectedType and dynamicProps when component mounts or connectionType changes
    useEffect(() => {
        if (!selectedType) {
            const defs = connectionType === 'db' ? dbDef : emailDef;
            const initialSelectedType = defs[0].name.toLowerCase();

            updateSelectedType(initialSelectedType, defs);
        }
    }, [connectionType]);

    return (
        <div style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
            {/* Delete Icon */}
            <button onClick={() => removeConnection(id)} style={{ float: 'right' }}>
                🗑️
            </button>

            {/* Connection Type Selector */}
            <select
                value={connectionType}
                onChange={(e) => updateConnectionType(e.target.value as 'db' | 'email')}
            >
                <option value="db">Database Connection</option>
                <option value="email">Email Connection</option>
            </select>

            {/* Provider Type Selector and Form */}
            {connectionType === 'db' && (
                <div>
                    <select
                        value={selectedType}
                        onChange={(e) => updateSelectedType(e.target.value, dbDef)}
                    >
                        {dbDef.map((def) => (
                            <option key={def.name} value={def.name.toLowerCase()}>
                                {def.name}
                            </option>
                        ))}
                    </select>
                    <FormWithArray
                        s={s}
                        handleEvent={handleEvent}
                        lens={lensBuilder.focuson('formData').build()}
                        dynamicProps={dynamicProps}
                    />
                </div>
            )}

            {connectionType === 'email' && (
                <div>
                    <select
                        value={selectedType}
                        onChange={(e) => updateSelectedType(e.target.value, emailDef)}
                    >
                        {emailDef.map((def) => (
                            <option key={def.name} value={def.name.toLowerCase()}>
                                {def.name}
                            </option>
                        ))}
                    </select>
                    <FormWithArray
                        s={s}
                        handleEvent={handleEvent}
                        lens={lensBuilder.focuson('formData').build()}
                        dynamicProps={dynamicProps}
                    />
                </div>
            )}
        </div>
    );
}
