import React, { useEffect } from 'react';
import { StateContext } from './state.context';
import { Event } from '../events/events'
import { eventProcessor } from '../events/events.processors';
import { AppState } from '../App';
import debounce from 'lodash.debounce';
import { useEventStore } from "../events/event.store";
import { allInterpreters } from '../interpreter/interpreter';

type StateProviderProps = {
    initialState: AppState;
    children: React.ReactNode;
};

export function StateProvider({ initialState, children }: StateProviderProps) {
    const [state, setState] = React.useState<AppState>(initialState);
    const [events, setEvents] = React.useState<Event[]>([]);
    const [ result, setResult ] = React.useState<any>(null);
    const [interpreter, setInterpreter] = React.useState<string>('asJson');
    const [eventFileSha, setEventFileSha] = React.useState<string | null>(null);

    const eventStore = useEventStore();

    useEffect(() => {
      loadEvents(interpreter)
    }, [interpreter]);

    const loadEvents = async (selectedInterpreter: string) => {
        try {

            const interpreter = allInterpreters[selectedInterpreter];
            if(!interpreter) throw new Error(`Interpreter "{selectedInterpreter} not found`);

            const { events: rawEvents, sha } = await eventStore.getEvents<Event[]>(0);
            const processedResult = await interpreter.process(rawEvents);

            setEvents(rawEvents);
            setResult(interpreter.render(processedResult));
            setEventFileSha(sha);
            
            if (selectedInterpreter === 'asJson') {
                setState(processedResult as AppState);
            } else {
                setState(initialState); //Reset state for non-JSON interpreters
            }
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
