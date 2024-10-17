import {
    AddConnectionEvent,
    BaseEvent,
    EventNameAnd,
    Event,
    ErrorEvent,
    RemoveConnectionEvent,
    SetValueEvent,
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

export const setValueEventProcessor: EventProcessorFn<AppState, SetValueEvent> = async (processor, event, state, setEvents) => {
    let lens = processor.parseLens(event.path);

    setEvents((prevStore) => ({
        events: [...prevStore.events, event],
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

