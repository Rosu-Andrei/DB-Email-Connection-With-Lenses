import {
    AddConnectionEvent,
    BaseEvent,
    EventNameAnd,
    Event,
    ErrorEvent,
    RemoveConnectionEvent,
    SetInputValueEvent
} from "./events";
import {dbDef, emailDef} from "../utils/component.prop";
import {AppState} from "../App";
import {PathToLensFn} from "../utils/lens";

export type EventProcessorFn<S, E extends BaseEvent> = (p: EventProcessors<S>, event: E, s: S ) => Promise<S>
export let lastEvent: Event;

export interface EventProcessors<S> {
    processors: EventNameAnd<EventProcessorFn<S, any>>
    parseLens: PathToLensFn<S>
}

export const addConnectionEventProcessor: EventProcessorFn<AppState, AddConnectionEvent> = async (processor, event, state) => {
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

    //events.push(event);
    lastEvent = event;

    return newState;
};

export const removeConnectionEventProcessor: EventProcessorFn<AppState, RemoveConnectionEvent> = async (processor, event, state) => {
    const { connectionId } = event;
    const { [connectionId]: _, ...restConnections } = state.connections;
    const newState: AppState = {
        ...state,
        connections: restConnections,
    };
    lastEvent = event;

    return newState;
};

export const setInputValueEventProcessor: EventProcessorFn<AppState, SetInputValueEvent> = async (processor, event, state) => {
        let lens = processor.parseLens(event.path);
        lastEvent = event;

        return lens.set(state, event.value);
}

export type EventProcessorResult<S> = {
    state?: S
    errors: ErrorEvent[]
}

export async function processEvent<S> (processor: EventProcessors<S>, startState: S, e: Event ): Promise<EventProcessorResult<S>> {
    try {
        let processorFn: EventProcessorFn<S, any> = processor.processors[ e.event ] //retrieves the specific processing function for the event
        if ( !processorFn ) return { errors: [ { event: 'error', error: `No processor for event ${e.event}`, path:''} ] };
        let state = await processorFn ( processor, e, startState );
        return { state, errors: [] }
    } catch ( e: any ) {
        return { errors: [ { event: 'error', error: `Error in processEvent ${e.message}`, path:'' } ] };
    }
}

