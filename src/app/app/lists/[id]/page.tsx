import Link from "next/link";
import { notFound } from "next/navigation";
import { PlaceCard } from "@/components/PlaceCard";
import { getListById } from "@/lib/data/lists";
import { getPlacesByListId } from "@/lib/data/places";

export const dynamic = "force-dynamic";

export default async function ListDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const list = await getListById(id);
  if (!list) notFound();

  const places = await getPlacesByListId(list.id);

  return (
    <main className="mx-auto max-w-4xl px-4 pb-24 pt-6">
      <Link href="/app/lists" className="text-sm font-bold text-tomato">
        Back to lists
      </Link>

      <section className="mt-4 rounded-lg bg-white p-5 shadow-sm ring-1 ring-stone-200">
        <div className="flex items-start gap-4">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-sm font-black text-white"
            style={{ backgroundColor: list.color }}
          >
            {list.avatar}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-tomato">{list.ownerName}</p>
            <h1 className="text-3xl font-black text-ink">{list.name}</h1>
            <p className="mt-2 text-sm leading-6 text-stone-600">{list.description}</p>
            <p className="mt-3 text-sm font-bold text-stone-500">{places.length} saved places</p>
          </div>
        </div>

        <Link
          href={`/app/map?lists=${list.id}`}
          className="mt-5 inline-flex rounded-full bg-ink px-5 py-3 text-sm font-bold text-white"
        >
          View this list on map
        </Link>
      </section>

      <section className="mt-5 grid gap-3 sm:grid-cols-2">
        {places.map((place) => (
          <PlaceCard
            key={place.id}
            place={place}
            href={`/app/place/${place.id}?from=${encodeURIComponent(`/app/lists/${list.id}`)}`}
          />
        ))}
      </section>
    </main>
  );
}
