import type { PlaceComment } from "@/types";
import { getPlaceById } from "@/lib/data/places";

export type CreateCommentInput = {
  placeId: string;
  userId?: string;
  author: string;
  comment: string;
};

export function getCommentsByPlaceId(placeId: string): PlaceComment[] {
  // MVP fallback: comments are embedded in mock places until the comments table is connected.
  return getPlaceById(placeId)?.comments ?? [];
}

export async function createComment(input: CreateCommentInput) {
  // Future Supabase insert target: comments(place_id, user_id, comment).
  return {
    id: `mock-comment-${Date.now()}`,
    placeId: input.placeId,
    author: input.author,
    text: input.comment
  };
}
