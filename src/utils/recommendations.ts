import type { MergedPlace, RecommendationResult } from "@/types";
import { distanceMeters } from "@/utils/distance";
import { knownLocations, searchKnownLocations, searchOneMap } from "@/utils/location";
import { getPlacesForSelectedLists } from "@/lib/data/places";

const tagKeywords: Record<string, string[]> = {
  Dessert: ["dessert", "sweet", "ice cream", "waffle", "pancake", "matcha"],
  Cafe: ["cafe", "coffee", "brunch", "study"],
  Japanese: ["japanese", "ramen", "sushi"],
  Korean: ["korean", "bbq"],
  Local: ["local", "hawker", "chicken rice", "murtabak"],
  "Cheap Eats": ["cheap", "budget", "value"],
  "Date Spot": ["date", "romantic"],
  Chill: ["chill", "relaxed"],
  "Good for Groups": ["group", "friends"],
  "Solo Meal": ["solo", "alone"],
  "Late Night": ["late", "supper"],
  "Hidden Gem": ["hidden"],
  Bakery: ["bakery", "pastry", "croissant"],
  Thai: ["thai"],
  Drinks: ["drink", "tea"]
};

export function extractTags(query: string) {
  const normalized = query.toLowerCase();
  return Object.entries(tagKeywords)
    .filter(([, keywords]) => keywords.some((keyword) => normalized.includes(keyword)))
    .map(([tag]) => tag);
}

export function extractLocationPhrase(query: string) {
  const normalized = query.toLowerCase();
  const knownMatch = knownLocations.find((location) => {
    const shortName = location.name.toLowerCase().replace(" mrt", "");
    return normalized.includes(location.name.toLowerCase()) || normalized.includes(shortName);
  });
  if (knownMatch) return knownMatch.name;

  const nearMatch = query.match(/\bnear\s+([^,.]+)(?:[,.]|$)/i);
  if (nearMatch?.[1]) return nearMatch[1].trim();

  const goingMatch = query.match(/\bgoing to\s+([^,.]+)(?:\s+and|[,.]|$)/i);
  if (goingMatch?.[1]) return goingMatch[1].trim();

  return "Orchard MRT";
}

export function scorePlace(
  place: MergedPlace,
  tags: string[],
  reference: { latitude: number; longitude: number },
  radiusMeters: number
): RecommendationResult | null {
  const placeDistance = distanceMeters(reference, place);
  const categoryMatches = place.categories.filter((category) => tags.includes(category));
  const moodMatches = place.moodTags.filter((tag) => tags.includes(tag));
  const matchedTags = [...categoryMatches, ...moodMatches];

  let score = 0;
  score += categoryMatches.length * 50;
  score += moodMatches.length * 30;
  if (place.savedBySelected.length > 1) score += 20;
  if (place.status === "favourite") score += 20;
  if (place.status === "tried") score += 10;
  if (placeDistance <= 300) score += 40;
  else if (placeDistance <= 600) score += 25;
  else if (placeDistance <= radiusMeters) score += 10;
  else score -= 15;

  if (placeDistance > radiusMeters && matchedTags.length === 0) return null;

  return {
    ...place,
    distanceMeters: Math.round(placeDistance),
    score,
    matchedTags
  };
}

export async function recommendPlaces(query: string, selectedListIds: string[]) {
  const interpretedTags = extractTags(query);
  const interpretedLocation = extractLocationPhrase(query);
  const radiusMeters = 1000;
  const known = searchKnownLocations(interpretedLocation)[0];
  let reference = known;

  if (!reference) {
    try {
      reference = (await searchOneMap(interpretedLocation))[0];
    } catch {
      reference = knownLocations[0];
    }
  }

  const visiblePlaces = getPlacesForSelectedLists(selectedListIds);
  const strictResults = visiblePlaces
    .map((place) => scorePlace(place, interpretedTags, reference, radiusMeters))
    .filter((place): place is RecommendationResult => Boolean(place))
    .filter((place) => place.distanceMeters <= radiusMeters);

  const fallbackResults =
    strictResults.length >= 3
      ? strictResults
      : visiblePlaces
          .map((place) => scorePlace(place, interpretedTags, reference, 1800))
          .filter((place): place is RecommendationResult => Boolean(place));

  const results = fallbackResults
    .sort((a, b) => b.score - a.score || a.distanceMeters - b.distanceMeters)
    .slice(0, 5);

  return {
    interpretedLocation: reference.name,
    interpretedTags,
    radiusMeters,
    results
  };
}
