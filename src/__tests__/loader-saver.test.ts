import { load, save } from '../loader-saver/loader-saver';
import { EventNamespaceDescription } from '../namespace/events.namespace.description';
import { NameSpaceDescription } from '../namespace/namespace.description';
import { TextEncoder, TextDecoder } from 'text-encoding';

const mockLoader = jest.fn();
const mockSaver = jest.fn();

const MockNamespaceDescription: NameSpaceDescription<any[]> = {
    path: (org, namespace, name) => `${org}/${namespace}/${name}`,
    writer: (data) => new TextEncoder().encode(JSON.stringify(data)),
    parser: (data) => JSON.parse(new TextDecoder().decode(data)),
    contentType: 'application/json',
    allowAppend: true,
    allowOffset: true
};

describe('Loader-Saver Abstraction', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Ensures that data is correctly loaded using the loader
    it('should load data using the loader', async () => {
        // Mocking the loader to return a Uint8Array with a JSON string and a sha
        const mockData = new Uint8Array(new TextEncoder().encode('[{"id": 1}]'));
        mockLoader.mockResolvedValue({ byteArray: mockData, sha: 'mock-sha'});

        const result = await load(MockNamespaceDescription, mockLoader, 'org', 'namespace', 'name');
        // Assert that the loader was called with the correct path
        expect(mockLoader).toHaveBeenCalledWith('org/namespace/name');
        // Assert that the data was parsed correctly into JSON
        expect(result.data).toEqual([{ id: 1 }]);
        //Assert that the correct sha was returned
        expect(result.sha).toBe('mock-sha');
    });

    // Ensures that data is correctly saved usig the saver
    it('should save data using the saver', async () => {
        const mockData = [{ id: 1}];

        // Mocking the loader to simulate an existing file 
        mockLoader.mockResolvedValue({
            byteArray: new Uint8Array(new TextEncoder().encode('[{"id": 1 }]')),
            sha: null
        })

        //call the save function with the mock saver
        await save(MockNamespaceDescription, mockSaver, 'org', 'namespace', 'name', null, mockData, false, mockLoader);
        
        //Encode the mock data to Uint8Array for comparison
        const byteArray = new TextEncoder().encode(JSON.stringify(mockData));

        // Assert that the saver was called with the correct arguments
        expect(mockSaver).toHaveBeenCalledWith('org/namespace/name', byteArray, null);
    });

    it('should load data with an offset', async () => {
        const mockData = new Uint8Array(new TextEncoder().encode('[{"id":1},{"id":2},{"id":3}]'));

        mockLoader.mockResolvedValue({
            byteArray: mockData,
            sha: 'mock-sha'
        });
        const offset = 1;//skip the first event
        const result = await load(EventNamespaceDescription, mockLoader, 'org', 'namespace', 'name', offset);

        expect(result.data).toEqual([{ id: 2}, { id: 3 }]);
    });
})