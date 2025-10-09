import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto w-full max-w-md">
        <div className="rounded-xl border border-amber-300 bg-white p-8 shadow-sm">
          <h1 className="mb-4 text-center text-2xl font-semibold text-neutral-900">
            Website not found
          </h1>
          <p className="mb-6 text-center text-sm text-neutral-600">
            We couldn’t scan this website. Please check the address and try again.
          </p>
          <Link
            href="/"
            className="inline-block w-full rounded-md bg-gradient-to-r from-amber-600 to-amber-700 px-4 py-3 text-base font-medium text-white shadow-sm transition hover:from-amber-700 hover:to-amber-800"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
