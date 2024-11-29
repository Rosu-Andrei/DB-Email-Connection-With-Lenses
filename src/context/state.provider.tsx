import React, {useEffect} from 'react';
import { StateContext } from './state.context';
import { Event } from '../events/events'
import { eventProcessor } from '../events/events.processors';
import { AppState } from '../App';
import debounce from 'lodash.debounce';
import {useEventStore} from "../events/event.store";

type StateProviderProps = {
    initialState: AppState;
    children: React.ReactNode;
};

export function StateProvider({ initialState, children }: StateProviderProps) {
    const [state, setState] = React.useState<AppState>(initialState);
    const [events, setEvents] = React.useState<Event[]>([]);
    const [eventFileSha, setEventFileSha] = React.useState<string | null>(null);

    const eventStore = useEventStore();

    useEffect(() => {
      loadEvents()
    }, []);

    const loadEvents = async () => {
        try {
            const { events: loadedEvents, sha } = await eventStore.getEvents();
            // Update events state
            setEvents(Array.isArray(loadedEvents) ? loadedEvents : []);
            setEventFileSha(sha);

            // Process loaded events to reconstruct state
            const newState = eventProcessor(loadedEvents, initialState) as AppState;
            setState(newState);
        } catch (error) {
            console.error('Failed to load events:', error);
        }
    };

    const debouncedSaveEvents = React.useRef(
        debounce(async (eventsToSave: Event[], sha: string | null) => {
            try {
                await eventStore.saveEvents(eventsToSave, sha);
            } catch (error) {
                console.error('Failed to save events:', error);
            }
        }, 5000)
    ).current;


    const handleEvent = (event: Event) => {
        const newState = eventProcessor([event], state) as AppState;
        setState(newState);

        setEvents((prevEvents) => {
            const safePrevEvents = Array.isArray(prevEvents) ? prevEvents : [];
            const updatedEvents = [...safePrevEvents, event];
            debouncedSaveEvents(updatedEvents, eventFileSha);
            return updatedEvents;
        });
    };

    return (
        <StateContext.Provider value={{ state, handleEvent, events }}>
            {children}
        </StateContext.Provider>
    );
}
