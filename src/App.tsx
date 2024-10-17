import React, { useState } from 'react';
import './App.css';
import { lensBuilder, pathToLens } from './utils/lens';
import { ConnectionComponent } from './component/ConnectionComponent';
import {
    addConnectionEventProcessor,
    removeConnectionEventProcessor,
    EventProcessors,
    processEvent,
    setValueEventProcessor
} from "./events/event.processors";
import { AddConnectionEvent, RemoveConnectionEvent, Event } from "./events/events";
import {DisplayEvents, EventStore} from "./events/event.store";

export type AppState = {
    connections: { [key: string]: any };
};

const eventProcessor: EventProcessors<AppState> = {
    processors: {
        addConnection: addConnectionEventProcessor,
        removeConnection: removeConnectionEventProcessor,
        setValue: setValueEventProcessor,
        error: async (p, e, s) => s, // Placeholder for error handling
    },
    parseLens: pathToLens(),
};

function App() {
    const [state, setState] = useState<AppState>({ connections: {} });
    const [events, setEvents] = useState<EventStore>({ events: [] });

    const handleEvent = <E extends Event>(event: E) => {
        processEvent(eventProcessor, state, event, setEvents).then((result) => {
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
            path: 'connections',
            connectionId: id,
            connectionType: initialConnectionType,
        };

       handleEvent(event);
    };

    const removeConnection = (id: string) => {
        const event : RemoveConnectionEvent = {
            event: 'removeConnection',
            path: 'connections',
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
                        handleEvent={handleEvent}
                        lens={connectionLens}
                        removeConnection={removeConnection}
                    />
                );
            })}

            <DisplayEvents events={events.events} />
        </div>
    );
}

export default App;
