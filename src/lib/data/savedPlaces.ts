import type { FoodPlace, PlaceStatus } from "@/types";

export type CreateSavedPlaceInput = {
  listId: string;
  placeId: string;
  userId?: string;
  note?: string;
  status?: PlaceStatus;
  rating?: number;
  priceRange?: FoodPlace["priceRange"];
};

export async function createSavedPlace(input: CreateSavedPlaceInput) {
  // MVP fallback: the UI currently updates local React state instead of writing to Supabase.
  // When persistence is enabled, replace this with an insert into saved_places.
  return {
    id: `mock-save-${Date.now()}`,
    ...input,
    status: input.status ?? "want_to_try"
  };
}
