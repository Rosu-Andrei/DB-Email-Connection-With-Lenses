import { useStateOps } from "./context/state.context";
import { AppendValueEvent, RemoveConnectionEvent } from "./events/events";
import { dbDef } from "./utils/component.prop";
import { lensBuilder } from "./utils/lens";
import { ConnectionComponent } from "./component/connection.component";
import { AppState } from "./App";

export function AppContent() {
    const { state, handleEvent, events, result, interpreter, handleInterpreterChange } = useStateOps<AppState>();
    console.log("events type:", Array.isArray(events), events);

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

            {/* Interpretor Selector */}
            <div>
                <label htmlFor="interpreter-select">Interpreter: </label>
                <select
                    id="interpreter-select"
                    value={interpreter}
                    onChange={(e) => handleInterpreterChange(e.target.value)}
                    >
                        <option value ="asJson">JSON</option>
                        <option value ="count">count</option>
                    </select>
            </div>


            {/* Connections */}
            {state.connections.length > 0 ? (
                state.connections.map((connection, index) => (
                    <ConnectionComponent
                            key={index}
                            index={index}
                            id={connection.id}
                            lens={lensBuilder<AppState>().focuson('connections').focuson(index).build()}
                            removeConnection={removeConnection}
                        />
                ))
            ) : (
                <p>No connections available</p>
            )}

            {/*Display the Result*/}
            <h2>Result</h2>
            {result !== null && <p>{`Result: ${result}`}</p>}

            {/* Displaying the state in JSON format */}
            <pre>{JSON.stringify(state, null, 2)}</pre>

            <h2>Events</h2>
            {/* Render events list if it's not empty */}
            {events.length > 0 ? (
                <pre style={{ backgroundColor: '#f0f0f0', padding: '10px' }}>
                    {events.map((event, index) => JSON.stringify(event)).join('\n')}
                </pre>
            ) : (
                <p>No events available</p>  // Show this if events array is empty
            )}
        </div>
    );
}
