import { EventStoreInterface } from './EventStore';
import { Event } from './events';
import { loadEventsFromGitHub, saveEventsToGitHub } from '../utils/github';

const githubToken = process.env.REACT_APP_GITHUB_TOKEN!;
const owner = process.env.REACT_APP_GITHUB_OWNER!;
const repo = process.env.REACT_APP_GITHUB_REPOSITORY!;
const path = process.env.REACT_APP_GITHUB_PATH!;

export const eventStoreUsingGithub: EventStoreInterface = {
    getEvents: async () => {
        const { content, sha } = await loadEventsFromGitHub(owner, repo, path, githubToken);
        const eventLines = content.split('\n').filter((line) => line.trim() !== '');
        const events = eventLines.map((line) => JSON.parse(line) as Event);
        return { events, sha };
    },
    saveEvents: async (events: Event[], sha: string | null) => {
        const content = events.map((event) => JSON.stringify(event)).join('\n');
        await saveEventsToGitHub(owner, repo, path, content, sha, githubToken);
    },
};
