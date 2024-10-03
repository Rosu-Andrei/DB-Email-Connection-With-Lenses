// src/App.tsx

import React, { useState } from 'react';
import './App.css';
import { lensBuilder } from './utils/lens';
import { allDef, emailDef } from './utils/db.component.prop';
import { ConnectionComponent } from './component/ConnectionComponent';

type AppState = {
    connections: { [key: string]: any };
};

function App() {
    const [state, setState] = useState<AppState>({ connections: {} });

    const addConnection = () => {
        const id = Date.now().toString();
        const initialConnectionType: 'db' | 'email' = 'db';
        const defs = initialConnectionType === 'db' ? allDef : emailDef;
        const initialSelectedType = defs[0].name.toLowerCase();
        const def = defs.find((d) => d.name.toLowerCase() === initialSelectedType);

        setState((prevState) => ({
            ...prevState,
            connections: {
                ...prevState.connections,
                [id]: {
                    connectionType: initialConnectionType,
                    selectedType: initialSelectedType,
                    dynamicProps: def ? def.render : [],
                    formData: {},
                },
            },
        }));
    };

    const removeConnection = (id: string) => {
        setState((prevState) => {
            const { [id]: _, ...rest } = prevState.connections;
            return { ...prevState, connections: rest };
        });
    };

    return (
        <div className="App">
            <button onClick={addConnection} style={{ position: 'absolute', top: 10, right: 10 }}>
                +
            </button>

            {Object.keys(state.connections).map((id) => {
                const connectionLens = lensBuilder<AppState>()
                    .focusOn('connections')
                    .focusOn(id)
                    .build();

                return (
                    <ConnectionComponent
                        key={id}
                        id={id}
                        s={state}
                        setS={setState}
                        lens={connectionLens}
                        removeConnection={removeConnection}
                    />
                );
            })}
        </div>
    );
}

export default App;
