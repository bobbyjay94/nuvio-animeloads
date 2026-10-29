
/**
 * AnimeLoads DE
 * Nuvio Provider
 */

import { extractStreams } from './extractor.js';

async function getStreams(tmdbId, mediaType, season, episode) {
    try {
        console.log(
            `[AnimeLoads] Anfrage: ${mediaType} ${tmdbId}`
        );

        const streams = await extractStreams(
            tmdbId,
            mediaType,
            season,
            episode
        );

        return streams;
    } catch (error) {
        console.error(
            `[AnimeLoads] Fehler: ${error.message}`
        );
        return [];
    }
}

module.exports = { getStreams };

