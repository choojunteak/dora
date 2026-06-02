import Link from "next/link";
import { getFoodListsWithCounts } from "@/lib/data/lists";

export default function ListsPage() {
  const foodLists = getFoodListsWithCounts();

  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-6">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-tomato">Food lists</p>
          <h1 className="text-3xl font-black text-ink">Choose whose taste to trust</h1>
        </div>
        <Link href="/app/map" className="rounded-full bg-ink px-4 py-2 text-sm font-bold text-white">
          Map
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {foodLists.map((list) => {
          return (
            <Link
              key={list.id}
              href={`/app/lists/${list.id}`}
              className="block rounded-lg bg-white p-5 shadow-sm ring-1 ring-stone-200 transition hover:-translate-y-0.5 hover:shadow-soft"
            >
              <div className="flex items-start gap-4">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-black text-white"
                  style={{ backgroundColor: list.color }}
                >
                  {list.avatar}
                </div>
                <div>
                  <h2 className="text-lg font-black text-ink">{list.name}</h2>
                  <p className="mt-1 text-sm text-stone-500">
                    {list.ownerName} saves - {list.placeCount} places
                  </p>
                  <p className="mt-3 text-sm leading-6 text-stone-600">{list.description}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
