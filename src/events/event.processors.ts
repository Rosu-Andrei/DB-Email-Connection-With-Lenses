import {
    AddConnectionEvent,
    BaseEvent,
    EventNameAnd,
    Event,
    ErrorEvent,
    RemoveConnectionEvent,
    SetInputValueEvent, UpdateConnectionTypeEvent, UpdateSelectedTypeEvent
} from "./events";
import {dbDef, emailDef} from "../utils/component.prop";
import {AppState} from "../App";
import {PathToLensFn} from "../utils/lens";

export type EventProcessorFn<S, E extends BaseEvent> = (p: EventProcessors<S>, event: E, s: S ) => Promise<S>
export let events: Event[] = [];

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

    events.push(event);

    return newState;
};

export const updateConnectionTypeEventProcessor: EventProcessorFn<
    AppState,
    UpdateConnectionTypeEvent> = async (processor, event, state) => {
    const { connectionId, connectionType } = event;
    const connectionLens = processor.parseLens(`connections.${connectionId}`);

    // Update the connectionType
    let newState = connectionLens.focusOn('connectionType').set(state, connectionType);

    // Reset selectedType, dynamicProps, and formData
    newState = connectionLens.focusOn('selectedType').set(newState, '');
    newState = connectionLens.focusOn('dynamicProps').set(newState, []);
    newState = connectionLens.focusOn('formData').set(newState, {});

    events.push(event);

    return newState;
};


export const updateSelectedTypeEventProcessor: EventProcessorFn<
    AppState,
    UpdateSelectedTypeEvent> = async (processor, event, state) => {
    const { connectionId, selectedType, defs } = event;
    const connectionLens = processor.parseLens(`connections.${connectionId}`);

    // Update the selectedType
    let newState = connectionLens.focusOn('selectedType').set(state, selectedType);

    // Find the definition for the selected type
    const def = defs?.find((d) => d.name.toLowerCase() === selectedType);

    // Update dynamicProps
    newState = connectionLens.focusOn('dynamicProps').set(newState, def ? def.render : []);

    // Reset formData
    newState = connectionLens.focusOn('formData').set(newState, {});

    const { defs: _, ...eventWithoutDefs } = event;
    events.push(eventWithoutDefs);

    return newState;
};


export const removeConnectionEventProcessor: EventProcessorFn<AppState, RemoveConnectionEvent> = async (processor, event, state) => {
    const { connectionId } = event;
    const { [connectionId]: _, ...restConnections } = state.connections;
    const newState: AppState = {
        ...state,
        connections: restConnections,
    };
    events.push(event);

    return newState;
};

export const setInputValueEventProcessor: EventProcessorFn<AppState, SetInputValueEvent> = async (processor, event, state) => {
        let lens = processor.parseLens(event.path);
        events.push(event);

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

