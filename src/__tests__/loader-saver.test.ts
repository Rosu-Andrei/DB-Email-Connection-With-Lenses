import { load, save } from '../loader-saver/loader-saver';
import { NameSpaceDescription } from '../namespace/namespace.description';
import { TextEncoder, TextDecoder } from 'text-encoding';
import {EventNamespaceDescription} from "../namespace/events.namespace.description";

const mockLoader = jest.fn();
const mockSaver = jest.fn();

const MockNamespaceDescription: NameSpaceDescription<any[]> = {
    path: (org, namespace, name) => `${org}/${namespace}/${name}`,
    writer: (data) => new TextEncoder().encode(JSON.stringify(data)),
    parser: (data) => JSON.parse(new TextDecoder().decode(data)),
    contentType: 'application/json',
    allowAppend: true,
    allowOffset: true,
};

describe('Loader-Saver Abstraction', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should load data using the loader', async () => {
        const mockData = new Uint8Array(new TextEncoder().encode('[{"id":1}]')); // Mock valid JSON
        mockLoader.mockResolvedValue({ byteArray: mockData, sha: 'mock-sha' });

        const result = await load(MockNamespaceDescription, mockLoader, 'org', 'namespace', 'name');
        expect(mockLoader).toHaveBeenCalledWith('org/namespace/name');
        expect(result.data).toEqual([{ id: 1 }]);
        expect(result.sha).toBe('mock-sha');
    });

    it('should save data using the saver', async () => {
        const mockData = [{ id: 1 }];
        mockLoader.mockResolvedValue({
            byteArray: new Uint8Array(new TextEncoder().encode('[{"id":1}]')),
            sha: null,
        });

        await save(MockNamespaceDescription, mockSaver, 'org', 'namespace', 'name', null, mockData, false, mockLoader);

        const byteArray = new TextEncoder().encode(JSON.stringify(mockData));
        expect(mockSaver).toHaveBeenCalledWith('org/namespace/name', byteArray, null);
    });

    it('should load data with an offset', async () => {
        const mockData = new Uint8Array(new TextEncoder().encode('[{"id":1},{"id":2},{"id":3}]'));

        mockLoader.mockResolvedValue({
            byteArray: mockData,
            sha: 'mock-sha',
        });

        const offset = 1; // Skip the first event
        const result = await load(EventNamespaceDescription, mockLoader, 'org', 'namespace', 'name', offset);

        expect(result.data).toEqual([{ id: 2 }, { id: 3 }]);
    });

});
