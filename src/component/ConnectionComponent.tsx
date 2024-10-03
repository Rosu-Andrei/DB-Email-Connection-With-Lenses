// src/component/ConnectionComponent.tsx

import React, { useEffect } from 'react'; // Import useEffect
import { LensAndPath, LensBuilder } from '../utils/lens';
import { allDef, ConnectionDef, emailDef } from '../utils/db.component.prop';
import { FormWithArray } from './FormWithArray';

type ConnectionComponentProps<S> = {
    id: string;
    s: S;
    setS: (s: S) => void;
    lens: LensAndPath<S, any>;
    removeConnection: (id: string) => void;
};

export function ConnectionComponent<S>({
                                           id,
                                           s,
                                           setS,
                                           lens,
                                           removeConnection,
                                       }: ConnectionComponentProps<S>) {
    const connection = lens.get(s) || {};

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
        let newState = connectionTypeLens.set(s, value);
        newState = selectedTypeLens.set(newState, '');
        newState = dynamicPropsLens.set(newState, []);
        newState = formDataLens.set(newState, {}); // Reset formData
        setS(newState);
    };

    const updateSelectedType = (value: string, defs: ConnectionDef[]) => {
        let newState = selectedTypeLens.set(s, value);
        const def = defs.find((d) => d.name.toLowerCase() === value);
        newState = dynamicPropsLens.set(newState, def ? def.render : []);
        newState = formDataLens.set(newState, {}); // Reset formData
        setS(newState);
    };

    // useEffect to set default selectedType and dynamicProps when component mounts or connectionType changes
    useEffect(() => {
        if (!selectedType) {
            const defs = connectionType === 'db' ? allDef : emailDef;
            const initialSelectedType = defs[0].name.toLowerCase();
            const def = defs.find((d) => d.name.toLowerCase() === initialSelectedType);

            let newState = selectedTypeLens.set(s, initialSelectedType);
            newState = dynamicPropsLens.set(newState, def ? def.render : []);
            setS(newState);
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
                        onChange={(e) => updateSelectedType(e.target.value, allDef)}
                    >
                        {allDef.map((def) => (
                            <option key={def.name} value={def.name.toLowerCase()}>
                                {def.name}
                            </option>
                        ))}
                    </select>
                    <FormWithArray
                        s={s}
                        setS={setS}
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
                        setS={setS}
                        lens={lensBuilder.focusOn('formData').build()}
                        dynamicProps={dynamicProps}
                    />
                </div>
            )}
        </div>
    );
}
