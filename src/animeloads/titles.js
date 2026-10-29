
/**
 * AnimeLoads DE
 * Titelzuordnung
 */

const KNOWN_TITLES = {
    "one piece": "one-piece",
    "demon slayer": "kimetsu-no-yaiba",
    "demon slayer kimetsu no yaiba": "kimetsu-no-yaiba",
    "kimetsu no yaiba": "kimetsu-no-yaiba",
    "bleach thousand year blood war":
        "bleach-sennen-kessen-hen",
    "bleach sennen kessen hen":
        "bleach-sennen-kessen-hen"
};

function normalizeTitle(title) {
    return String(title || "")
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .trim();
}

export function getAnimeLoadsCandidates(titles) {
    const candidates = new Set();

    for (const title of titles || []) {
        const normalized = normalizeTitle(title);

        if (!normalized) continue;

        if (KNOWN_TITLES[normalized]) {
            candidates.add(KNOWN_TITLES[normalized]);
        }

        candidates.add(
            normalized.replace(/\s+/g, "-")
        );
    }

    return [...candidates].map(slug => ({
        slug,
        url: `https://www.anime-loads.org/media/${slug}`
    }));
}
