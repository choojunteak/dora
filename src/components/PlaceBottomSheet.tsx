"use client";

import Link from "next/link";
import type { MergedPlace } from "@/types";
import { formatDistance } from "@/utils/distance";
import { appleMapsLink, googleMapsLink } from "@/utils/places";
import { FriendAvatarStack } from "@/components/FriendAvatarStack";
import { TagChip } from "@/components/TagChip";

type Props = {
  place: MergedPlace | null;
  distanceMeters?: number;
  onClose: () => void;
  onSave: () => void;
  onViewRecommendations?: () => void;
};

export function PlaceBottomSheet({
  place,
  distanceMeters,
  onClose,
  onSave,
  onViewRecommendations
}: Props) {
  if (!place) return null;
  const distance = formatDistance(distanceMeters);

  return (
    <section className="fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[48dvh] max-w-xl overflow-y-auto rounded-t-lg bg-white p-4 shadow-soft ring-1 ring-stone-200 bottom-sheet-scroll sm:bottom-4 sm:max-h-[56dvh] sm:rounded-lg">
      <div className="mb-2 flex items-center justify-between gap-3">
        {onViewRecommendations ? (
          <button
            type="button"
            onClick={onViewRecommendations}
            className="text-xs font-black text-tomato underline-offset-4 hover:underline"
          >
            &larr; Recommendations
          </button>
        ) : (
          <span aria-hidden="true" />
        )}
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-full bg-stone-100 px-3 py-2 text-sm font-black text-stone-600"
          aria-label="Close place details"
        >
          X
        </button>
      </div>

      <div className="mb-3">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wide text-tomato">
            {place.categories[0]} - {place.priceRange}
            {distance ? ` - ${distance}` : ""}
          </p>
          <h2 className="mt-1 text-xl font-black leading-tight text-ink">{place.name}</h2>
          <p className="mt-1 text-sm leading-5 text-stone-600">{place.address}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <FriendAvatarStack listIds={place.selectedListIds} />
        <p className="text-sm font-semibold text-stone-600">
          Saved by {place.savedBySelected.join(", ")}
        </p>
      </div>

      <p className="mt-3 text-sm leading-6 text-stone-700">{place.notes}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {[...place.categories, ...place.moodTags].map((tag) => (
          <TagChip key={tag} label={tag} />
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onSave}
          className="rounded-full bg-tomato px-3 py-2 text-xs font-bold text-white"
        >
          Save
        </button>
        <a
          href={googleMapsLink(place)}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-ink px-3 py-2 text-xs font-bold text-white"
        >
          Google Maps
        </a>
        <a
          href={appleMapsLink(place)}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-white px-3 py-2 text-xs font-bold text-ink ring-1 ring-stone-200"
        >
          Apple Maps
        </a>
        <Link
          href={`/app/place/${place.id}`}
          className="rounded-full bg-stone-100 px-3 py-2 text-xs font-bold text-stone-700"
        >
          Details
        </Link>
      </div>

      <div className="mt-4 space-y-2">
        {place.comments.map((comment) => (
          <p key={`${comment.author}-${comment.text}`} className="text-sm text-stone-600">
            <span className="font-bold text-ink">{comment.author}:</span> {comment.text}
          </p>
        ))}
      </div>

      {place.sources.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {place.sources.map((source) => (
            <a
              key={source.url}
              href={source.url}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-tomato underline"
            >
              {source.type} source
            </a>
          ))}
        </div>
      ) : null}
    </section>
  );
}
