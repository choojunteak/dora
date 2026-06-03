import { foodLists, foodPlaces } from "@/data/mockData";
import type { FoodList } from "@/types";
import { getSupabaseFoodData } from "@/lib/data/supabaseFoodData";

export type FoodListWithCount = FoodList & {
  placeCount: number;
};

export async function getFoodLists(): Promise<FoodList[]> {
  const supabaseData = await getSupabaseFoodData();
  return supabaseData?.lists.length ? supabaseData.lists : foodLists;
}

export async function getFoodListsWithCounts(): Promise<FoodListWithCount[]> {
  const supabaseData = await getSupabaseFoodData();
  const lists = supabaseData?.lists.length ? supabaseData.lists : foodLists;
  const places = supabaseData?.places.length ? supabaseData.places : foodPlaces;

  return lists.map((list) => ({
    ...list,
    placeCount: places.filter((place) => place.listIds.includes(list.id)).length
  }));
}

export async function getListById(listId: string): Promise<FoodList | null> {
  const lists = await getFoodLists();
  return lists.find((list) => list.id === listId) ?? null;
}

export async function getListPlaceCount(listId: string): Promise<number> {
  const supabaseData = await getSupabaseFoodData();
  const places = supabaseData?.places.length ? supabaseData.places : foodPlaces;

  return places.filter((place) => place.listIds.includes(listId)).length;
}
