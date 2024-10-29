import { saveEventsToGitHub, owner, path, repo } from '../utils/github'; // Adjust the import path as necessary

describe('Optimistic Locking Tests', () => {
    const mockFetch = jest.fn();
    const token = 'mock_token';

    beforeEach(() => {
        global.fetch = mockFetch; // Mock the global fetch function
    });

    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });

    it('should successfully save events when the SHA matches', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValue({ message: 'File updated successfully' }),
        });

        const content = JSON.stringify([{ event: 'testEvent' }]);
        const sha = 'mock_sha';

        const result = await saveEventsToGitHub(owner, repo, path, content, sha, token);

        expect(mockFetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
            method: 'PUT',
            body: JSON.stringify({
                message: 'Update events',
                content: btoa(content),
                sha,
            }),
        }));
        expect(result.message).toEqual('File updated successfully');
    });

    it('should throw an error when the SHA does not match', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 409, // Simulate conflict status
        });

        const content = JSON.stringify([{ event: 'testEvent' }]);
        const sha = 'mock_sha';

        await expect(saveEventsToGitHub(owner, repo, path, content, sha, token)).rejects.toThrow('Conflict: The file has been modified by another user.');
    });

    it('should throw an error for other fetch failures', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            statusText: 'Bad Request',
        });

        const content = JSON.stringify([{ event: 'testEvent' }]);
        const sha = 'mock_sha';

        await expect(saveEventsToGitHub(owner, repo, path, content, sha, token)).rejects.toThrow('Failed to save events: Bad Request');
    });
});
