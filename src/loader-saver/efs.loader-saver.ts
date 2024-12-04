import { Loader, Saver } from "./loader-saver";
import { EventNamespaceDescription } from "../namespace/events.namespace.description";

/**
 * EFS Loader implementation.
 *
 * @param path - Path to the file in EFS.
 * @returns {Object} - Contains byteArray (file data as Uint8Array) and sha (always null for EFS).
 */
export const efsLoader: Loader = async (path: string) => {
    const response = await fetch(`${path}`, {
        method: "GET",
        headers: { "Accept": "application/octet-stream"}
    });

    if (!response.ok) {
        throw new Error(`Failed to load events: ${response.statusText}`);
    }

    const data = await response.arrayBuffer();

    return {
        byteArray: new Uint8Array(data),
        sha: null,
    };
};


export const efsSaver: Saver = async (path: string, bytes: Uint8Array) => {
    const response = await fetch(`${path}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/octet-stream',
        },
        body: bytes,
    });

    if (!response.ok) {
        throw new Error(`Failed to save events: ${response.statusText}`);
    }
};
