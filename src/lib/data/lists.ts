import { foodLists, foodPlaces } from "@/data/mockData";
import type { FoodList } from "@/types";

export type FoodListWithCount = FoodList & {
  placeCount: number;
};

export function getFoodLists(): FoodList[] {
  // MVP fallback: until Supabase persistence is wired, all list reads come from mock data.
  return foodLists;
}

export function getFoodListsWithCounts(): FoodListWithCount[] {
  return getFoodLists().map((list) => ({
    ...list,
    placeCount: foodPlaces.filter((place) => place.listIds.includes(list.id)).length
  }));
}

export function getListById(listId: string): FoodList | null {
  return getFoodLists().find((list) => list.id === listId) ?? null;
}

export function getListPlaceCount(listId: string): number {
  return foodPlaces.filter((place) => place.listIds.includes(listId)).length;
}
