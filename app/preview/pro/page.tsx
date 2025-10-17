import dynamic from "next/dynamic";

const ProPreview = dynamic(() => import("@/components/ProPreview"), {
  ssr: false,
});

export const revalidate = 0;
export const dynamicParams = true;
export const fetchCache = "force-no-store";

export default function Page() {
  return (
    <main className="bg-gray-50 font-sans text-neutral-800">
      <div className="mx-auto max-w-2xl px-6 pt-20 pb-16">
        <ProPreview />
      </div>
    </main>
  );
}
