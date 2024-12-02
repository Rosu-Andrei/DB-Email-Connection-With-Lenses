import { EventStoreInterface } from './event.store';
import { Event } from './events';
import { EventNamespaceDescription } from "../namespace/events.namespace.description";
import { load, save } from "../loader-saver/loader-saver";
import { efsLoader, efsSaver } from "../loader-saver/efs.loader-saver";

const org = process.env.REACT_APP_EFS_ORG!;
const namespace = process.env.REACT_APP_EFS_NAMESPACE!;
const name = process.env.REACT_APP_EFS_NAME!;

export const eventStoreUsingEFS: EventStoreInterface = {
    getEvents: async (offset = 0) => {
        const loadResult = await load(EventNamespaceDescription, efsLoader, org, namespace, name, offset);

        return {
            events: loadResult.data,
            offset: loadResult.offset,
            sha: loadResult.sha
        };
    },

    saveEvents: async (events: Event[], sha: string | null) => {
        await save(EventNamespaceDescription, efsSaver, org, namespace, name, sha,  events, false, efsLoader);
    }
};
