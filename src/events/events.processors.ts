import {
    Event,
    RemoveConnectionEvent,
    SetValueEvent, AppendValueEvent,
} from "./events";
import { lensFromPath } from "../utils/lens";

export function appendValueEventProcessor<T>(start: Partial<T>, e: AppendValueEvent): Partial<T> {
    const lens = lensFromPath<any>(e.path) // lens points to an array
    const oldArray = lens.get(start)
    return lens.set(start, [...oldArray, e.value])
}

export function setValueEventProcessor<T>(start: Partial<T>, e: SetValueEvent): Partial<T> {
    const lens = lensFromPath<any>(e.path)
    return lens.set(start, e.value)
}

export function removeConnectionEventProcessor<T>(start: Partial<T>, e: RemoveConnectionEvent): Partial<T> {
    const lens = lensFromPath<any>(e.path);
    const connections = lens.get(start) || [];
    const updatedConnections = connections.filter(
        (conn: any) => conn.id !== e.connectionId
    );
    return lens.set(start, updatedConnections);
}

export function oneProcessor<T>(start: Partial<T>, e: Event): Partial<T> {
    switch (e.event) {
        case 'setValue':
            return setValueEventProcessor(start, e)
        case 'appendValue':
            return appendValueEventProcessor(start, e)
        case "removeConnection":
            return removeConnectionEventProcessor(start, e)
        default:
            throw new Error(`Unknown event type ${JSON.stringify(e)}`)
    }
}

export function eventProcessor<T>(events: Event[], start: Partial<T>): Partial<T> {
    console.log("Events for processing:", events);
    return events.reduce((acc, e) => oneProcessor(acc, e), start)
}


