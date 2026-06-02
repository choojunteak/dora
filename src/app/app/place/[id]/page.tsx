import Link from "next/link";
import { notFound } from "next/navigation";
import { PlaceCard } from "@/components/PlaceCard";
import { appleMapsLink, googleMapsLink } from "@/utils/places";
import { getPlaceById } from "@/lib/data/places";

export default async function PlacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const place = getPlaceById(id);
  if (!place) notFound();

  const mergedPlace = { ...place, selectedListIds: place.listIds, savedBySelected: place.savedBy };

  return (
    <main className="mx-auto max-w-3xl px-4 pb-24 pt-6">
      <Link href="/app/map" className="text-sm font-bold text-tomato">
        Back to map
      </Link>
      <div className="mt-4">
        <PlaceCard place={mergedPlace} isLarge />
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <a
          href={googleMapsLink(place)}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-ink px-4 py-2 text-sm font-bold text-white"
        >
          Open in Google Maps
        </a>
        <a
          href={appleMapsLink(place)}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-white px-4 py-2 text-sm font-bold text-ink ring-1 ring-stone-200"
        >
          Open in Apple Maps
        </a>
      </div>
    </main>
  );
}
