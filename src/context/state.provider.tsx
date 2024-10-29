import React, {useEffect} from 'react';
import { StateContext } from './state.context';
import { Event } from '../events/events'
import { eventProcessor } from '../events/event.processors';
import { AppState } from '../App';
import debounce from 'lodash.debounce';
import { loadEventsFromGitHub, saveEventsToGitHub } from '../utils/github';

type StateProviderProps = {
    initialState: AppState;
    children: React.ReactNode;
};

export function StateProvider({ initialState, children }: StateProviderProps) {
    const [state, setState] = React.useState<AppState>(initialState);
    const [events, setEvents] = React.useState<Event[]>([]);
    const [eventFileSha, setEventFileSha] = React.useState<string | null>(null);

    const githubToken = process.env.REACT_APP_GITHUB_TOKEN;
    const owner = process.env.REACT_APP_GITHUB_OWNER;
    const repo = process.env.REACT_APP_GITHUB_REPOSITORY;
    const path = process.env.REACT_APP_GITHUB_PATH;

    //This hook runs the loadEvents function when the githubToken changes. If the token is present, it will load events from GitHub.
    useEffect(() => {
        if (githubToken) {
            loadEvents();
        }
    }, [githubToken]);

    const loadEvents = async () => {
        try {
            const { content, sha } = await loadEventsFromGitHub(owner!, repo!, path!, githubToken!);
            const eventLines = content.split('\n').filter((line) => line.trim() !== '');
            const loadedEvents = eventLines.map((line) => JSON.parse(line));

            // Update events state
            setEvents(loadedEvents);
            setEventFileSha(sha);

            // Process loaded events to reconstruct state
            const newState = eventProcessor(loadedEvents, initialState) as AppState;
            setState(newState);
        } catch (error) {
            console.error('Failed to load events from GitHub:', error);
        }
    };

    // Debounced function to save events to GitHub
    const debouncedSaveEvents = React.useRef(
        debounce(async (eventsToSave: Event[], sha: string | null) => {
            try {
                const content = eventsToSave.map((event) => JSON.stringify(event)).join('\n');
                const data = await saveEventsToGitHub(owner!, repo!, path!, content, sha, githubToken!);
                setEventFileSha(data.content.sha); //because every time we'll make a change, we will have a new sha
            } catch (error) {
                console.error('Failed to save events to GitHub:', error);
            }
        }, 5000)
    ).current;


    const handleEvent = (event: Event) => {
        const newState = eventProcessor([event], state) as AppState;
        setState(newState);

        setEvents((prevEvents) => {
            const updatedEvents = [...prevEvents, event];
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
