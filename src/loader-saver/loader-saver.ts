import { NameSpaceDescription } from "../namespace/namespace.description";

export type Loader = (path: string) => Promise<{ byteArray: Uint8Array; sha: string | null }>;
export type Saver = (path: string, bytes: Uint8Array, sha?: string | null) => Promise<void>;

export type LoadResult<T> = {
    data: T;
    offset: number;
    sha: string | null;
};

export async function load<T>(
    desc: NameSpaceDescription<T>,
    loader: Loader,
    org: string,
    ns: string,
    name: string,
    offset: number = 0
): Promise<LoadResult<T>> {
    const path = desc.path(org, ns, name);

    // Call the loader
    const { byteArray, sha } = await loader(path);

    const parsedData = desc.parser(byteArray, offset);

    return {
        data: parsedData,
        offset: byteArray.length, 
        sha, 
    };
}

export async function save<T>(
    desc: NameSpaceDescription<T>,
    saver: Saver,
    org: string,
    ns: string,
    name: string,
    sha: string | null,
    t: T,
    append: boolean = false,
    loader?: Loader
): Promise<void> {
    const path = desc.path(org, ns, name);

    const byteArray = desc.writer(t);

    // If updating (append = true) or no sha is provided, fetch the sha
    if (append || !sha) {
        if (!loader) {
            throw new Error("Loader must be provided to fetch the sha.");
        }

        // Fetch the existing file to get its sha
        const loadResult = await load(desc, loader, org, ns, name);
        sha = loadResult.sha;
    }

    if (append) {
        const existingData = await loader!(path); // Append requires loader
        const updatedData = new Uint8Array(existingData.byteArray.length + byteArray.length);
        updatedData.set(existingData.byteArray, 0);
        updatedData.set(byteArray, existingData.byteArray.length);

        await saver(path, updatedData);
    } else {
        await saver(path, byteArray, sha); // Pass sha to saver
    }
}
