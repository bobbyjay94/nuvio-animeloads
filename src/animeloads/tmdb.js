
import { fetchJson } from './http.js';

const TMDB_BASE = 'https://api.themoviedb.org/3';

export async function getAnimeInfo(
    tmdbId,
    mediaType,
    apiKey
) {
    if (!tmdbId || !apiKey) {
        return null;
    }

    const type = mediaType === 'movie'
        ? 'movie'
        : 'tv';

    const url =
        `${TMDB_BASE}/${type}/${tmdbId}` +
        `?api_key=${encodeURIComponent(apiKey)}` +
        `&append_to_response=alternative_titles`;

    const data = await fetchJson(url);

    const titles = new Set([
        data.name,
        data.original_name,
        data.title,
        data.original_title
    ]);

    const alternatives =
        data.alternative_titles?.results ||
        data.alternative_titles?.titles ||
        [];

    for (const item of alternatives) {
        if (item.title) titles.add(item.title);
    }

    return {
        tmdbId,
        mediaType: type,
        titles: [...titles].filter(Boolean),
        year: (
            data.first_air_date ||
            data.release_date ||
            ''
        ).slice(0, 4)
    };
}
