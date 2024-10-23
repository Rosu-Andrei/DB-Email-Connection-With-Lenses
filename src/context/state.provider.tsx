import React from 'react';
import { StateContext } from './state.context';
import { Event } from '../events/events'
import { eventProcessor } from '../events/event.processors';
import { AppState } from '../App';

type StateProviderProps = {
    initialState: AppState;
    children: React.ReactNode;
};

export function StateProvider({ initialState, children }: StateProviderProps) {
    const [state, setState] = React.useState<AppState>(initialState);
    const [events, setEvents] = React.useState<Event[]>([]);

    const handleEvent = (event: Event) => {
        const newState = eventProcessor([event], state) as AppState;
        setState(newState);
        setEvents((prevEvents) => [...prevEvents, event]);
    };

    return (
        <StateContext.Provider value={{ state, handleEvent, events }}>
            {children}
        </StateContext.Provider>
    );
}
