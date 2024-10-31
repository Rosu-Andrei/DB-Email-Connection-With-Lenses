import { EventStoreInterface } from './event.store';
import { Event } from './events';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export const eventStoreUsingEFS: EventStoreInterface = {
    getEvents: async () => {
        const response = await fetch(`${backendUrl}/events`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) {
            throw new Error(`Failed to load events: ${response.statusText}`);
        }
        const data = await response.json();
        return { events: data.events, sha: data.version };
    },

    saveEvents: async (events: Event[], sha: string | null) => {
        const response = await fetch(`${backendUrl}/events`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ events, version: sha }),
        });
        if (!response.ok) {
            if (response.status === 409) {
                throw new Error('Conflict: The file has been modified by another user.');
            }
            throw new Error(`Failed to save events: ${response.statusText}`);
        }
        const data = await response.json();
        sha = data.version;
    },
};
