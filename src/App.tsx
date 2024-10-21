import React, { useState } from 'react';
import './App.css';
import { lensBuilder } from './utils/lens';
import { ConnectionComponent } from './component/ConnectionComponent';
import { oneProcessor } from "./events/event.processors";
import {RemoveConnectionEvent, Event, AppendValueEvent} from "./events/events";
import {DisplayEvents, EventStore} from "./events/event.store";
import {dbDef} from "./utils/component.prop";

export type AppState = {
    connections: any[];
};

function App() {
    const [state, setState] = useState<AppState>({ connections: [] });
    const [events, setEvents] = useState<EventStore>({ events: [] });

    const handleEvent = <E extends Event>(event: E) => {
        const newState = oneProcessor(state, event) as AppState;
        setState(newState);
        setEvents((prevStore) => ({
            events:[...prevStore.events, event],
        }));
    };

    const addConnection = () => {
        const id = Date.now().toString();
        const initialConnectionType: 'db' | 'email' = 'db';

        const event: AppendValueEvent = {
            event: 'appendValue',
            path: `connections`,
            connectionId: id,
            value: {
                id: id,
                connectionType: initialConnectionType,
                selectedType: 'mysql',
                dynamicProps: dbDef.find((d) => d.name.toLowerCase() === 'mysql')?.render || [],
                formData: {}
            }
        };
        handleEvent(event);
    };

    const removeConnection = (id: string) => {
        const event: RemoveConnectionEvent = {
            event: 'removeConnection',
            path: 'connections',
            connectionId: id,
        };

        handleEvent(event);
    };

    return (
        <div className="App">
            <button onClick={addConnection} style={{position: 'absolute', top: 10, right: 10}}>
                +
            </button>

            {state.connections.map((connection, index) => {
                const connectionLens = lensBuilder<AppState>()
                    .focuson('connections')
                    .focuson(index) // Use index for array
                    .build();

                return (
                    <ConnectionComponent
                        index={index}
                        id={connection.id}
                        s={state}
                        handleEvent={handleEvent}
                        lens={connectionLens}
                        removeConnection={removeConnection}
                    />
                );
            })}

            <pre>
                {
                    JSON.stringify(state, null, 2)
                }
            </pre>
            <DisplayEvents events={events.events} />

        </div>
    );
}

export default App;


// const eventProcessor: EventProcessors<AppState> = {
//     processors: {
//         //addConnection: addConnectionEventProcessor,
//         removeConnection: removeConnectionEventProcessor,
//         setValue: setValueEventProcessor,
//         appendValue: appendValueEventProcessor,
//         error: async (p, e, s) => s, // Placeholder for error handling
//     },
//     parseLens: pathToLens(),
// };