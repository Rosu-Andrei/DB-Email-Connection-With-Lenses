import { EventStoreInterface } from './event.store';
import { Event } from './events';
import { EventNamespaceDescription } from "../namespace/events.namespace.description";
import { load, save } from "../loader-saver/loader-saver";
import { githubLoader, githubSaver } from "../loader-saver/github.loader-saver";

const org = process.env.REACT_APP_GITHUB_OWNER!;
const namespace = process.env.REACT_APP_GITHUB_REPOSITORY!;
const name = process.env.REACT_APP_GITHUB_NAME!;

export const eventStoreUsingGithub: EventStoreInterface = {
    getEvents: async (offset = 0) => {
        const loadResult = await load(EventNamespaceDescription, githubLoader, org, namespace, name, offset);

        return {
            events: loadResult.data,
            offset: loadResult.offset,
            sha: loadResult.sha
        };
    },

    saveEvents: async (events: Event[], sha: string | null) => {
        await save(EventNamespaceDescription, githubSaver, org, namespace, name, sha, events, false, githubLoader);
    }
};
