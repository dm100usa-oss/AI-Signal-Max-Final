import Link from "next/link";

export function SectionCard({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-md border border-neutral-200 p-5 transition-colors hover:border-neutral-300 hover:bg-neutral-50"
    >
      <h3 className="text-base font-semibold tracking-tight text-neutral-900">
        {title}
      </h3>
      <p className="mt-1.5 text-sm text-neutral-600 leading-relaxed">
        {description}
      </p>
    </Link>
  );
}
