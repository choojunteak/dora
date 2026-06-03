import type { PlaceSource } from "@/types";
import { getPlaceById } from "@/lib/data/places";

export async function getSourcesByPlaceId(placeId: string): Promise<PlaceSource[]> {
  return (await getPlaceById(placeId))?.sources ?? [];
}
