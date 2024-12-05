import { EventNamespaceDescription } from '../namespace/events.namespace.description';
import { Event } from '../events/events';
import { TextEncoder, TextDecoder } from 'text-encoding';

describe('EventNamespaceDescription', () => {
    const sampleEvents: Event[] = [
        { event: 'appendValue', path: 'connections', connectionId: '1', value: { id: '1' } },
        { event: 'removeConnection', path: 'connections', connectionId: '2' },
    ];

    // Test the writer function, which serializes events into a Uint8Array
    it('should correctly serialize events to Uint8Array', () => {
        const result = EventNamespaceDescription.writer(sampleEvents);
        // Ensure the result is of type Uint8Array
        expect(result).toBeInstanceOf(Uint8Array);

        // Decode the Uint8Array back to a JSON string and verify its structure matches the input
        const jsonString = new TextDecoder().decode(result);
        expect(JSON.parse(jsonString)).toEqual(sampleEvents);
    });

    // Test the parser function, which deserializes a Uint8Array back into events
    it('should correctly parse Uint8Array back to events', () => {
        // Prepare a JSON string and convert it to a Uint8Array
        const jsonString = JSON.stringify(sampleEvents, null, 2);
        const byteArray = new TextEncoder().encode(jsonString);

        // Use the parser to convert the Uint8Array back into events and validate the result
        const result = EventNamespaceDescription.parser(byteArray, 0);
        expect(result).toEqual(sampleEvents);
    });

    // Test the parser with empty data to ensure it handles edge cases gracefully
    it('should handle empty data gracefully', () => {
        // Pass an empty Uint8Array to the parser
        const emptyByteArray = new Uint8Array();
        const result = EventNamespaceDescription.parser(emptyByteArray, 0);
        // Expect an empty array as the result
        expect(result).toEqual([]);
    });

    // Test the path function, which generates a file path based on input parameters
    it('should construct the correct file path', () => {
        // Generate the path using the provided parameters
        const path = EventNamespaceDescription.path('org', 'namespace', 'name');
        // Validate that the output matches the expected format
        expect(path).toBe('org/namespace/name');
    });
});
