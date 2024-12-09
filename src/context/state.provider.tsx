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
    const [ result, setResult ] = React.useState<any>(null);
    const [interpreter, setInterpreter] = React.useState<string>('count');
    const [eventFileSha, setEventFileSha] = React.useState<string | null>(null);

    const eventStore = useEventStore();

    useEffect(() => {
      loadEvents(interpreter)
    }, [interpreter]);

    const loadEvents = async (selectedInterpreter: string) => {
        try {

            const { events: processedStateOrResult, sha } = await eventStore.getEvents<any>(0, selectedInterpreter);
            console.log(`Processed with ${selectedInterpreter}:`, processedStateOrResult);

            setEvents(await eventStore.getEvents<Event[]>(0).then(res => res.events));
            
            if (selectedInterpreter === 'asJson') {
                setState(processedStateOrResult);
                setResult(null);
            } else {
                setResult(processedStateOrResult);
                setState(initialState);
            }
            setEventFileSha(sha);
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

    const handleInterpreterChange = (newInterpreter: string) => {
        setInterpreter(newInterpreter);
    }

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
        <StateContext.Provider value={{ state, handleEvent, events, result, interpreter, handleInterpreterChange}}>
            {children}
        </StateContext.Provider>
    );
}
