import { NameSpaceDescription } from './namespace.description';
import { Event } from '../events/events';

export const EventNamespaceDescription: NameSpaceDescription<Event[]> = {
    path: (org, namespace, name) => `${org}/${namespace}/${name}`,

    writer: (data) => {
        const json = JSON.stringify(data);
        return new TextEncoder().encode(json);
    },

    parser: (data) => {
        const json = new TextDecoder().decode(data).trim();
        if (!json) {
            return [];
        }
        return JSON.parse(json) as Event[];
    },

    contentType: 'application/json',
};
