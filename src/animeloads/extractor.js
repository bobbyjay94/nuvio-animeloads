
/**
 * AnimeLoads DE
 * Stream-Extractor
 *
 * Priorität:
 * 1. GER Dub
 * 2. GER Sub
 */

function sortStreamsByLanguage(streams) {
    const priority = {
        "GER Dub": 0,
        "GER Sub": 1
    };

    return streams.sort((a, b) => {
        const aPriority = priority[a.language] ?? 99;
        const bPriority = priority[b.language] ?? 99;

        return aPriority - bPriority;
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

    if (!tmdbId) {
        return [];
    }

    // Hier folgt die Suche nach Anime und Episoden.
    const streams = [];

    // GER Dub zuerst, GER Sub danach.
    return sortStreamsByLanguage(streams);
}

