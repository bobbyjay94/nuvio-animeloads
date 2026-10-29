
/**
 * AnimeLoads - Nuvio Provider
 * Version: 1.0.0
 */

"use strict";

async function getStreams(tmdbId, mediaType, season, episode) {
  try {
    console.log(
      "[AnimeLoads] Anfrage:",
      tmdbId,
      mediaType,
      season,
      episode
    );

    // Die Anime-Suche und Stream-Anbindung
    // werden hier später ergänzt.

    return [];
  } catch (error) {
    console.error("[AnimeLoads] Fehler:", error);
    return [];
  }
}

module.exports = {
  getStreams
};
