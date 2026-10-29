
/**
 * AnimeLoads DE
 * Stream-Extractor
 */

import {
    getAnimeLoadsCandidates
} from './titles.js';

function sortStreamsByLanguage(streams) {
    const priority = {
        "GER Dub": 0,
        "GER Sub": 1
    };

    return [...streams].sort((a, b) => {
        return (priority[a.language] ?? 99)
             - (priority[b.language] ?? 99);
    });
}

export async function extractStreams(
    tmdbId,
    mediaType,
    season,
    episode
) {
    console.log("[AnimeLoads] Suche gestartet", {
        tmdbId,
        mediaType,
        season,
        episode
    });

    if (!tmdbId) return [];

    // Die TMDB-Titelabfrage wird im
    // nächsten Schritt angebunden.
    const titles = [];

    const candidates =
        getAnimeLoadsCandidates(titles);

    console.log(
        "[AnimeLoads] Mögliche Titel:",
        candidates
    );

    // Noch keine verifizierten Videoquellen.
    const streams = [];

    return sortStreamsByLanguage(streams);
}
