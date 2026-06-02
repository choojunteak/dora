import { foodPlaces } from "@/data/mockData";
import type { FoodPlace, MergedPlace } from "@/types";
import { getVisiblePlaces } from "@/utils/places";
import { getFoodLists, getListById } from "@/lib/data/lists";

export function getAllFoodPlaces(): FoodPlace[] {
  // MVP fallback: this is the single read boundary to replace with Supabase place queries later.
  return foodPlaces;
}

export function getPlaceById(placeId: string): FoodPlace | null {
  return getAllFoodPlaces().find((place) => place.id === placeId) ?? null;
}

export function getPlacesForSelectedLists(listIds: string[]): MergedPlace[] {
  return getVisiblePlaces(getAllFoodPlaces(), listIds);
}

export function getPlacesByListId(listId: string): MergedPlace[] {
  const list = getListById(listId);

  return getAllFoodPlaces()
    .filter((place) => place.listIds.includes(listId))
    .map((place) => ({
      ...place,
      selectedListIds: [listId],
      savedBySelected: [list?.ownerName ?? listId]
    }));
}

export function getFavouritePlaces(limit = 3): MergedPlace[] {
  const lists = getFoodLists();

  return getAllFoodPlaces()
    .filter((place) => place.status === "favourite")
    .slice(0, limit)
    .map((place) => ({
      ...place,
      selectedListIds: place.listIds,
      savedBySelected: place.listIds.map(
        (listId) => lists.find((list) => list.id === listId)?.ownerName ?? listId
      )
    }));
}
