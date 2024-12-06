import { Event } from '../events/events';
import { eventProcessor } from '../events/events.processors';
import {AppState} from "../App";

export type Interpreter = (events: Event[] ) => Promise<any>;

// The list of the available interpreters
export const interpreters: Record<string, Interpreter> = {
    count: async (events) => events.length,

    asJson: async (events) => {
        if (!Array.isArray(events)) {
            throw new Error('Invalid input: events must be an array');
        }
        const initialState: AppState = { connections: [] };
        return eventProcessor(events, initialState) as AppState;
    },
};
