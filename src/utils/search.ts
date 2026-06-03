import type { FoodPlace } from "@/types";
import { getAllFoodPlaces } from "@/lib/data/places";

export async function searchPlaces(query: string, places?: FoodPlace[]) {
  const searchablePlaces = places ?? (await getAllFoodPlaces());
  const normalized = query.trim().toLowerCase();
  if (!normalized) return searchablePlaces;

  return searchablePlaces.filter((place) => {
    const haystack = [
      place.name,
      place.address,
      place.categories.join(" "),
      place.moodTags.join(" "),
      place.notes
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(normalized);
  });
}
