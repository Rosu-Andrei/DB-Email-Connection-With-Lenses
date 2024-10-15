import React, { useEffect } from 'react';
import { LensAndPath, LensBuilder } from '../utils/lens';
import { dbDef, ConnectionDef, emailDef } from '../utils/component.prop';
import { FormWithArray } from './FormWithArray';
import {Event, UpdateConnectionTypeEvent, UpdateSelectedTypeEvent} from "../events/events";

type ConnectionComponentProps<S> = {
    id: string;
    s: S;
    handleEvent: (event: Event) => void;
    lens: LensAndPath<S, any>;
    removeConnection: (id: string) => void;
};

export function ConnectionComponent<S>({
                                           id,
                                           s,
                                           lens,
                                           handleEvent,
                                           removeConnection,
                                       }: ConnectionComponentProps<S>) {
    // Use LensBuilder to create lenses
    const lensBuilder = new LensBuilder(lens);
    const connectionTypeLens = lensBuilder.focusOn('connectionType').build();
    const selectedTypeLens = lensBuilder.focusOn('selectedType').build();
    const dynamicPropsLens = lensBuilder.focusOn('dynamicProps').build();
    const formDataLens = lensBuilder.focusOn('formData').build();

    const connectionType = connectionTypeLens.get(s) || 'db';
    const selectedType = selectedTypeLens.get(s) || '';
    const dynamicProps = dynamicPropsLens.get(s) || [];

    // Update functions
    const updateConnectionType = (value: 'db' | 'email') => {
        const event: UpdateConnectionTypeEvent = {
            event: 'updateConnectionType',
            path: 'type',
            connectionId: id,
            connectionType: value,
        };

        handleEvent(event);
    };

    const updateSelectedType = (value: string, defs: ConnectionDef[]) => {
        const event: UpdateSelectedTypeEvent = {
            event: 'updateSelectedType',
            path: 'type',
            connectionId: id,
            selectedType: value,
            defs: defs,
        };

        handleEvent(event);
    };

    // useEffect to set default selectedType and dynamicProps when component mounts or connectionType changes
    useEffect(() => {
        if (!selectedType) {
            const defs = connectionType === 'db' ? dbDef : emailDef;
            const initialSelectedType = defs[0].name.toLowerCase();

            const event: UpdateSelectedTypeEvent = {
                event: 'updateSelectedType',
                path: 'type',
                connectionId: id,
                selectedType: initialSelectedType,
                defs: defs,
            };

            handleEvent(event);
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
                        lens={lensBuilder.focusOn('formData').build()}
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
                        lens={lensBuilder.focusOn('formData').build()}
                        dynamicProps={dynamicProps}
                    />
                </div>
            )}
        </div>
    );
}
