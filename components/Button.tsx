import Link from "next/link";

type Variant = "primary" | "success" | "navy" | "amber";

const grad: Record<Variant, string> = {
  primary: "linear-gradient(180deg, #3B82F6 0%, #2563EB 55%, #1D4ED8 100%)",
  success: "linear-gradient(180deg, #22C55E 0%, #16A34A 55%, #15803D 100%)",
  navy: "linear-gradient(180deg, #2E6AA6 0%, #1a4a7a 55%, #143a61 100%)",
  amber: "linear-gradient(180deg, #E89823 0%, #D67B23 55%, #BC5E1F 100%)",
};

const pressColor: Record<Variant, string> = {
  primary: "rgba(22,70,180,1)",
  success: "rgba(18,120,60,1)",
  navy: "rgba(16,52,86,1)",
  amber: "rgba(168,84,28,1)",
};

export function ButtonLink({
  href,
  variant = "primary",
  external = false,
  fullWidth = true,
  children,
}: {
  href: string;
  variant?: Variant;
  external?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}) {
  const className = [
    "btn-press btn-press-grad",
    fullWidth ? "block w-full" : "inline-block",
    "rounded-[14px] px-6 py-3 text-center text-white",
    "text-lg font-semibold transition-all duration-200 ease-out sm:text-xl lg:text-base",
    "hover:scale-[1.01] active:scale-[0.98] md:ring-1 md:ring-black/5",
  ].join(" ");

  const style = {
    backgroundImage: grad[variant],
    boxShadow:
      "inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 6px rgba(30,40,60,0.12), 0 6px 16px rgba(30,40,60,0.16)",
    ["--press-bg" as string]: pressColor[variant],
  } as React.CSSProperties;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} style={style}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} style={style}>
      {children}
    </Link>
  );
}
