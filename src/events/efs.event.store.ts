import { EventStoreInterface } from './event.store';
import { Event } from './events';
import { EventNamespaceDescription } from "../namespace/events.namespace.description";

const org = process.env.REACT_APP_EFS_ORG!;
const namespace = process.env.REACT_APP_EFS_NAMESPACE!;
const name = process.env.REACT_APP_EFS_NAME!;

export const eventStoreUsingEFS: EventStoreInterface = {
    getEvents: async () => {
        const path = EventNamespaceDescription.path(org, namespace, name);
        const response = await fetch(`${path}`, {
            method: 'GET',
            headers: { 'Content-Type': EventNamespaceDescription.contentType },
        });
        if (!response.ok) {
            throw new Error(`Failed to load events: ${response.statusText}`);
        }

        const data = await response.arrayBuffer();
        const events = EventNamespaceDescription.parser(new Uint8Array(data));
        return { events, sha: response.headers.get('ETag') || null };
    },

    saveEvents: async (events: Event[], sha: string | null) => {
        const path = EventNamespaceDescription.path(org, namespace, name);

        // Serialize events to JSON and convert to byte array
        const byteArray = EventNamespaceDescription.writer(events);

        const response = await fetch(`${path}`, {
            method: 'POST',
            headers: {
                'Content-Type': EventNamespaceDescription.contentType,
                'If-Match': sha || '*',  // Handle concurrency if file version is provided
            },
            body: byteArray, // Send the byte array directly in the request body
        });

        if (!response.ok) {
            if (response.status === 409) {
                throw new Error('Conflict: The file has been modified by another user.');
            }
            throw new Error(`Failed to save events: ${response.statusText}`);
        }
    }
};
