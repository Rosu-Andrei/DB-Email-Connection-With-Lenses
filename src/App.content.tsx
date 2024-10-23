import {useStateOps} from "./context/state.context";
import {AppendValueEvent, RemoveConnectionEvent} from "./events/events";
import {dbDef} from "./utils/component.prop";
import {lensBuilder} from "./utils/lens";
import {ConnectionComponent} from "./component/ConnectionComponent";
import {DisplayEvents} from "./events/event.store";
import {AppState} from "./App";

export function AppContent() {
    const {state, handleEvent, events} = useStateOps<AppState>();

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
                dynamicProps:
                    dbDef.find((d) => d.name.toLowerCase() === 'mysql')?.render || [],
                formData: {},
            },
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
            <button onClick={addConnection} style={{ position: 'absolute', top: 10, right: 10 }}>
                +
            </button>

            {state.connections.map((connection, index) => {
                const connectionLens = lensBuilder<AppState>()
                    .focuson('connections')
                    .focuson(index) // Use index for array
                    .build();

                return (
                    <ConnectionComponent
                        key={index}
                        index={index}
                        id={connection.id}
                        lens={connectionLens}
                        removeConnection={removeConnection}
                    />
                );
            })}

            <pre>{JSON.stringify(state, null, 2)}</pre>

            <DisplayEvents events={events} />
        </div>
    );
}
