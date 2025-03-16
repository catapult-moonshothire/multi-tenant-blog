import { cn } from "@/lib/utils";
import { PencilLine } from "lucide-react";
import Link from "next/link";

export default function Header({
  hideButton = false,
}: {
  hideButton?: boolean;
}) {
  return (
    <header className="sticky top-0 h-12 z-50 p-0 bg-background/60 backdrop-blur">
      <div className="flex justify-between items-center max-w-[88rem] px-4 lg:px-0 mx-auto p-2">
        <Link
          title="brand-logo"
          className="relative mr-6 flex items-center space-x-2"
          href="/"
        >
          <PencilLine />
          <span className="font-semibold text-lg">Inscribe beta</span>
        </Link>
        {!hideButton && (
          <div className="space-x-2">
            <Link
              className={cn(
                "inline-flex items-center justify-center whitespace-nowrap  rounded-md text-sm font-medium transition-all focus-visible:outline-none h-8 px-4 py-2 focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                "bg-secondary border text-secondary-foreground shadow-sm hover:bg-secondary/80"
              )}
              href="/login"
            >
              LogIn
            </Link>
            <Link
              className="inline-flex items-center justify-center whitespace-nowrap text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary hover:bg-primary/90 px-4 py-2 h-8 text-primary-foreground rounded-lg group tracking-tight font-medium"
              href="/register"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
      <hr className="absolute w-full bottom-0" />
    </header>
  );
}
