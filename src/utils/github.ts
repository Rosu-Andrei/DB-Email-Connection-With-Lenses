export async function loadEventsFromGitHub(
    path: string,
    token: string
) {
    const url = `https://api.github.com/repos/${path}`;
    const response = await fetch(url, {
        headers: {
            Authorization: `token ${token}`,
            Accept: 'application/vnd.github.v3+json',
        },
    });

    if (response.ok) {
        const data = await response.json();
        const content = atob(data.content).trim();
        return {
            content,
            sha: data.sha, // Needed for updating the file
        };
    } else if (response.status === 404) {
        // File does not exist yet
        return {
            content: '',
            sha: null,
        };
    } else {
        throw new Error(`Failed to load events: ${response.statusText}`);
    }
}


export async function saveEventsToGitHub(
    path: string,
    content: string,
    sha: string | null,
    token: string
) {
    const url = `https://api.github.com/repos/${path}`;
    const message = 'Update events';
    const base64Content = btoa(unescape(encodeURIComponent(content)));
    console.log('GitHub Path:', path);

    const body: any = {
        message,
        content: base64Content,
    };

    if (sha) {
        body.sha = sha;
    }

    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            Authorization: `token ${token}`,
            Accept: 'application/vnd.github.v3+json',
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        if (response.status === 409) {
            throw new Error('Conflict: The file has been modified by another user.');
        }
        throw new Error(`Failed to save events: ${response.statusText}`);
    }

    return await response.json();
}
