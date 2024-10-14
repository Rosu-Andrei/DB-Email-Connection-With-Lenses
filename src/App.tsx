import React, { useState } from 'react';
import './App.css';
import { lensBuilder, pathToLens } from './utils/lens';
import { ConnectionComponent } from './component/ConnectionComponent';
import {
    addConnectionEventProcessor,
    removeConnectionEventProcessor,
    EventProcessors,
    lastEvent,
    processEvent,
    setInputValueEventProcessor
} from "./events/event.processors";
import { AddConnectionEvent, RemoveConnectionEvent, Event } from "./events/events";

export type AppState = {
    connections: { [key: string]: any };
};


const eventProcessor: EventProcessors<AppState> = {
    processors: {
        addConnection: addConnectionEventProcessor,
        updateConnection: async (p, e, s) => s, // placeholder for later
        removeConnection: removeConnectionEventProcessor,
        setInputValue: setInputValueEventProcessor,
        error: async (p, e, s) => s,
    },
    parseLens: pathToLens()
};


function App() {
    const [state, setState] = useState<AppState>({ connections: {} });

    const handleEvent = <E extends Event>(event: E) => {
        processEvent(eventProcessor, state, event).then((result) => {
            if (result.errors.length > 0) {
                console.error(result.errors);
            } else if (result.state) {
                setState(result.state);
            }
        });
    };

    const addConnection = () => {
        const id = Date.now().toString();
        const initialConnectionType: 'db' | 'email' = 'db';

        const event: AddConnectionEvent = {
            event: 'addConnection',
            path: 'connection',
            connectionId: id,
            connectionType: initialConnectionType,
        };

       handleEvent(event);
    };

    const removeConnection = (id: string) => {
        const event : RemoveConnectionEvent = {
            event: 'removeConnection',
            path: 'connection',
            connectionId: id
        }

        handleEvent(event);
    };

    return (
        <div className="App">
            <button onClick={addConnection} style={{position: 'absolute', top: 10, right: 10}}>
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
                        // setS={setState}
                        handleEvent={handleEvent}
                        lens={connectionLens}
                        removeConnection={removeConnection}
                    />
                );
            })}

            <h2>Events Log</h2>
            <pre style={{backgroundColor: '#f0f0f0', padding: '10px'}}>
                { JSON.stringify(lastEvent) }
            </pre>

        </div>


    );
}

export default App;
