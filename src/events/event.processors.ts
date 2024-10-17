import {
    AddConnectionEvent,
    BaseEvent,
    EventNameAnd,
    Event,
    ErrorEvent,
    RemoveConnectionEvent,
    SetValueEvent, AppendValueEvent,
} from "./events";
import {dbDef, emailDef} from "../utils/component.prop";
import {AppState} from "../App";
import {PathToLensFn} from "../utils/lens";
import {EventStore} from "./event.store";

export type EventProcessorFn<S, E extends BaseEvent> = (p: EventProcessors<S>, event: E, s: S, setEvents: React.Dispatch<React.SetStateAction<EventStore>> ) => Promise<S>

export interface EventProcessors<S> {
    processors: EventNameAnd<EventProcessorFn<S, any>>
    parseLens: PathToLensFn<S>
}


// Utility function to compact events
function compactEvents(events: Event[]): Event[] {
    const uniqueEvents = new Map<string, Event>();

    // Iterate through events and store only the most recent event for each path
    for (const event of events) {
        if (event.event === 'setValue') {
            // Replace previous events for the same path with the latest one
            uniqueEvents.set(event.path, event);
        } else {
            // For other types of events, keep them all (you may adjust this if necessary)
            uniqueEvents.set(`${event.event}:${event.path}`, event);
        }
    }

    // Return the compacted array of events
    return Array.from(uniqueEvents.values());
}

export const addConnectionEventProcessor: EventProcessorFn<AppState, AddConnectionEvent> = async (processor, event, state, setEvents) => {
    const { connectionId, connectionType } = event;
    const defs = connectionType === 'db' ? dbDef : emailDef;
    const initialSelectedType = defs[0].name.toLowerCase();
    const def = defs.find((d) => d.name.toLowerCase() === initialSelectedType);

    const newState = {
        ...state,
        connections: {
            ...state.connections,
            [connectionId]: {
                connectionType: connectionType,
                selectedType: initialSelectedType,
                dynamicProps: def ? def.render : [],
                formData: {},
            },
        },
    };

    setEvents((prevStore) => ({
        events: [...prevStore.events, event],
    }));

    return newState;
};

export const removeConnectionEventProcessor: EventProcessorFn<AppState, RemoveConnectionEvent> = async (processor, event, state, setEvents) => {
    const { connectionId } = event;
    const { [connectionId]: _, ...restConnections } = state.connections;
    const newState: AppState = {
        ...state,
        connections: restConnections,
    };
    setEvents((prevStore) => ({
        events: [...prevStore.events, event],
    }));

    return newState;
};

export const appendValueEventProcessor: EventProcessorFn<AppState, AppendValueEvent> = async (processor, event, state, setEvents) => {
    let lens = processor.parseLens(event.path);
    let value = lens.getOption(state);

    if (typeof value !== 'object' || value === null) {
        throw new Error(`Cannot append to non-object at ${event.path}. Value at that location is ${JSON.stringify(value)}`);
    }

    setEvents((prevStore) => ({
        events: [...prevStore.events, event],
    }));

    return lens.set(state, { ...value, ...event.value });
};


export const setValueEventProcessor: EventProcessorFn<AppState, SetValueEvent> = async (processor, event, state, setEvents) => {
    let lens = processor.parseLens(event.path);

    // Update the event store with the new event, then compact
    setEvents((prevStore) => ({
        events: compactEvents([...prevStore.events, event]), // Compact after adding the new event
    }));

    return lens.set(state, event.value);
}

export type EventProcessorResult<S> = {
    state?: S
    errors: ErrorEvent[]
}

export async function processEvent<S>(processor: EventProcessors<S>, startState: S, event: Event, setEvents: React.Dispatch<React.SetStateAction<EventStore>>
): Promise<EventProcessorResult<S>> {
    try {
        const processorFn: EventProcessorFn<S, any> = processor.processors[event.event]; // retrieves the specific processing function for the event
        if (!processorFn)
            return { errors: [{event: 'error', error: `No processor for event ${event.event}`, path: ''}]};
        const state = await processorFn(processor, event, startState, setEvents);
        return { state, errors: [] };
    } catch (e: any) {
        return { errors: [{event: 'error', error: `Error in processEvent ${e.message}`, path: ''}]};
    }
}

