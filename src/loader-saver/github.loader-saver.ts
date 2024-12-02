import { loadEventsFromGitHub, saveEventsToGitHub } from '../utils/github';
import {Loader, Saver} from "./loader-saver";

export const githubLoader: Loader = async (path: string) => {
    const response = await fetch(`https://api.github.com/repos/${path}`, {
        method: 'GET',
        headers: {
            Authorization: `token ${process.env.REACT_APP_GITHUB_TOKEN}`,
            Accept: 'application/vnd.github.v3+json',
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to load events: ${response.statusText}`);
    }

    const data = await response.json();
    const content = atob(data.content.trim()); // Decode Base64 content
    const byteArray = new TextEncoder().encode(content); // Convert content to Uint8Array

    return {
        byteArray, // Return the byteArray
        sha: data.sha || null, // Extract and return the sha
    };
};

export const githubSaver: Saver = async (path: string, bytes: Uint8Array, sha: string | null = null) => {
    const content = new TextDecoder().decode(bytes); // Convert bytes to string
    const base64Content = btoa(content); // Encode as Base64

    const body: any = {
        message: "Update events",
        content: base64Content,
    };

    // Add sha if it exists
    if (sha) {
        body.sha = sha;
    }

    const response = await fetch(`https://api.github.com/repos/${path}`, {
        method: "PUT",
        headers: {
            Authorization: `token ${process.env.REACT_APP_GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save events: ${response.statusText}, Details: ${errorText}`);
    }
};


