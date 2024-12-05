import { NameSpaceDescription } from './namespace.description';
import { Event } from '../events/events';
import { TextEncoder, TextDecoder } from 'text-encoding';

export const EventNamespaceDescription: NameSpaceDescription<Event[]> = {
    path: (org, namespace, name) => `${org}/${namespace}/${name}`,

    writer: (data) => {
        const json = JSON.stringify(data, null, 2);
        return new TextEncoder().encode(json);
    },

    parser: (data: Uint8Array, offset = 0) => {
        const json = new TextDecoder().decode(data).trim();
        if (!json) {
            return [];
        }

        // Parse the JSON string into an array
        const parsedArray = JSON.parse(json) as Event[];

        // Apply offset to the parsed array
        return parsedArray.slice(offset);
    },

    contentType: 'application/json',

    allowAppend: true,

    allowOffset: true,
};
