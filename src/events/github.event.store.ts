import { EventStoreInterface } from './event.store';
import { Event } from './events';
import { EventNamespaceDescription } from "../namespace/events.namespace.description";
import { load, save } from "../loader-saver/loader-saver";
import { githubLoader, githubSaver } from "../loader-saver/github.loader-saver";
import {interpreters} from "../interpreter/interpreter";

const org = process.env.REACT_APP_GITHUB_OWNER!;
const namespace = process.env.REACT_APP_GITHUB_REPOSITORY!;
const name = process.env.REACT_APP_GITHUB_NAME!;

export const eventStoreUsingGithub: EventStoreInterface = {
    getEvents: async <T = Event[]>(offset = 0, interpreter?: string) => {
        const loadResult = await load(EventNamespaceDescription, githubLoader, org, namespace, name, offset);

        let processedEvents: T | Event[] = loadResult.data; // Default raw events
        if (interpreter) {
            if (!(interpreter in interpreters)) {
                throw new Error(`Interpreter "${interpreter}" not found`);
            }
            processedEvents = (await interpreters[interpreter](loadResult.data)) as T; // Apply interpreter
        }

        return {
            events: processedEvents as T,
            offset: loadResult.offset,
            sha: loadResult.sha,
        };
    },

    saveEvents: async (events: Event[], sha: string | null) => {
        await save(EventNamespaceDescription, githubSaver, org, namespace, name, sha, events, false, githubLoader);
    },
};

