import type { PlaceSource } from "@/types";
import { getPlaceById } from "@/lib/data/places";

export function getSourcesByPlaceId(placeId: string): PlaceSource[] {
  // MVP fallback: source links are embedded in mock places until place_sources is connected.
  return getPlaceById(placeId)?.sources ?? [];
}
