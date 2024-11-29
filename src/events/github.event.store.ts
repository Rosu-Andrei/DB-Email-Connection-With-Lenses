import { EventStoreInterface } from './event.store';
import { Event } from './events';
import { loadEventsFromGitHub, saveEventsToGitHub } from '../utils/github';
 import { EventNamespaceDescription } from '../namespace/events.namespace.description';

const githubToken = process.env.REACT_APP_GITHUB_TOKEN!;
const org = process.env.REACT_APP_GITHUB_OWNER!;
const namespace = process.env.REACT_APP_GITHUB_REPOSITORY!;
const name = process.env.REACT_APP_GITHUB_NAME!;


export const eventStoreUsingGithub: EventStoreInterface = {
    getEvents: async () => {
        const path = EventNamespaceDescription.path(org, namespace, name);

        const { content, sha } = await loadEventsFromGitHub(path, githubToken);
        const byteArray = new TextEncoder().encode(content);
        const events = EventNamespaceDescription.parser(byteArray);

        return { events, sha };
    },
    saveEvents: async (events: Event[], sha: string | null) => {
        const path = EventNamespaceDescription.path(org, namespace, name);

        const byteArray = EventNamespaceDescription.writer(events);
        const content =  new TextDecoder().decode(byteArray);
        await saveEventsToGitHub(path, content, sha, githubToken);
    },
};
