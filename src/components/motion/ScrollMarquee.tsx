"use client";

export function ScrollMarquee({ items }: { items: string[] }) {
  return (
    <ul className="mt-10 flex flex-wrap justify-center gap-3">
      {items.map((a) => (
        <li
          key={a}
          className="rounded-full border border-porcelain/20 px-5 py-2 text-sm text-porcelain/90"
        >
          {a}
        </li>
      ))}
    </ul>
  );
}
