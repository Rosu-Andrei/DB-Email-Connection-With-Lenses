export type NameSpaceDescription<T> = {
    // Defines how to create the file path (e.g., org/namespace/name)
    path: (org: string, namespace: string, name: string) => string;
    // Serializes the object into bytes for storage
    writer: (data: T) => Uint8Array;
    // Parses bytes back into the object
    parser: (data: Uint8Array, offset: number) => T;
    contentType: string
    allowAppend: boolean;
    allowOffset: boolean;
};
