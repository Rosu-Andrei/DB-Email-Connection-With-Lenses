    import {Event} from "./events";

    export type EventStore = {
        events: Event[]
    }

    export function DisplayEvents({events}: {events: Event[]}) {
        return (
            <pre style={{backgroundColor: '#f0f0f0', padding: '10px'}}>
                 {events.map((event) => JSON.stringify(event)).join('\n')}
            </pre>
        )
    }