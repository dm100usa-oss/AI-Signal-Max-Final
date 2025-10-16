import dynamic from "next/dynamic";

const QuickPreview_v2 = dynamic(() => import("@/components/QuickPreview_v2"), {
  ssr: false,
});

export const revalidate = 0;
export const dynamicParams = true;
export const fetchCache = "force-no-store";

export default function Page() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center font-sans text-neutral-800">
      <div className="w-full max-w-2xl px-4 sm:px-6 py-10">
        <QuickPreview_v2 />
      </div>
    </main>
  );
}
