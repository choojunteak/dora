import type { FoodPlace } from "@/types";
import { getAllFoodPlaces } from "@/lib/data/places";

export function searchPlaces(query: string, places: FoodPlace[] = getAllFoodPlaces()) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return places;

  return places.filter((place) => {
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
