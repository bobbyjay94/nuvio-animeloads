
/**
 * AnimeLoads DE
 * HTTP Utilities
 */

export const HEADERS = {
    "Accept": "text/html,application/json"
};

export async function fetchText(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: {
            ...HEADERS,
            ...options.headers
        }
    });

    if (!response.ok) {
        throw new Error(
            `HTTP Fehler: ${response.status}`
        );
    }

    return await response.text();
}

export async function fetchJson(url, options = {}) {
    const text = await fetchText(url, options);
    return JSON.parse(text);
}
