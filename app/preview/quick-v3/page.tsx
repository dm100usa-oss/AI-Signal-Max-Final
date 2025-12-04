import dynamic from "next/dynamic";

const QuickPreview_v3 = dynamic(() => import("@/components/QuickPreview_v3"), {
  ssr: false,
});

export default function Page() {
  return <QuickPreview_v3 />;
}
