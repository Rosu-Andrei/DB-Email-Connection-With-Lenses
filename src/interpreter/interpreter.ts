import { Event } from '../events/events';
import { eventProcessor } from '../events/events.processors';
import { AppState } from "../App";

export type Interpreter<T> = {
    process: (events: Event[]) => Promise<T>; // How the data is processed
    render: (result: T) => string; // How the data is displayed
    mimetype: string; // MIME type for the result
};

export const countProcessor: Interpreter<number> = {
    process: async (events: Event[]) => events.length,
    render: (count) => JSON.stringify({ count }, null, 2),
    mimetype: 'application/json',
};

export const jsonProcessor: Interpreter<AppState> = {
    process: async (events: Event[]) => {
        const initialState: AppState = { connections: [] };
        return eventProcessor(events, initialState) as AppState;
    },
    render: (state) => JSON.stringify(state, null, 2),
    mimetype: 'application/json',
};

export const allInterpreters: Record<string, Interpreter<any>> = {
    count: countProcessor,
    asJson: jsonProcessor,
};
