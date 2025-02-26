import { History, Network, SquarePen } from "lucide-react";
import { Section } from "../layout/section";

export default function Section4() {
  return (
    <Section className="grid divide-y sm:grid-cols-2 sm:divide-x sm:divide-y-0">
      <div className="col-span-2 p-8 flex justify-center items-center  ">
        <h2 className="font-bold text-2xl text-center tracking-tight sm:text-3xl">
          Ownership, Quietly Engineered
        </h2>
      </div>
      <div className="grid md:grid-cols-3 col-span-2">
        <div className="flex flex-col gap-y-2 items-center justify-center py-8 px-4 border-b transition-colors hover:bg-secondary/20 last:border-b-0 md:[&:nth-child(2n+1)]:border-r md:[&:nth-child(n+5)]:border-b-0 lg:[&:nth-child(3n)]:border-r-0 lg:[&:nth-child(n+4)]:border-b-0 lg:border-r">
          <div className="flex flex-col gap-y-2 items-center">
            <Network />
            <h2 className="text-xl font-medium text-card-foreground text-center text-balance">
              Claim Your Corner of the Web
            </h2>
          </div>
          <p className="text-sm text-muted-foreground text-balance text-center max-w-md mx-auto">
            Connect your domain (yourname.com) or use ours. No DNS headaches.
          </p>
          <a
            className="text-sm text-primary hover:underline underline-offset-4 transition-colors hover:text-secondary-foreground"
            href="#"
          >
            Learn more &gt;
          </a>
        </div>
        <div className="flex flex-col gap-y-2 items-center justify-center py-8 px-4 border-b transition-colors hover:bg-secondary/20 last:border-b-0 md:[&:nth-child(2n+1)]:border-r md:[&:nth-child(n+5)]:border-b-0 lg:[&:nth-child(3n)]:border-r-0 lg:[&:nth-child(n+4)]:border-b-0 lg:border-r">
          <div className="flex flex-col gap-y-2 items-center">
            <SquarePen />
            <h2 className="text-xl font-medium text-card-foreground text-center text-balance">
              Write Like You're Building in Public
            </h2>
          </div>
          <p className="text-sm text-muted-foreground text-balance text-center max-w-md mx-auto">
            A distraction-free editor. Export to Markdown, PDF, or plain text.
          </p>
          <a
            className="text-sm text-primary hover:underline underline-offset-4 transition-colors hover:text-secondary-foreground"
            href="#"
          >
            Learn more &gt;
          </a>
        </div>
        <div className="flex flex-col gap-y-2 items-center justify-center py-8 px-4 border-b transition-colors hover:bg-secondary/20 last:border-b-0 md:[&:nth-child(2n+1)]:border-r md:[&:nth-child(n+5)]:border-b-0 lg:[&:nth-child(3n)]:border-r-0 lg:[&:nth-child(n+4)]:border-b-0 lg:border-r">
          <div className="flex flex-col gap-y-2 items-center">
            <History />
            <h2 className="text-xl font-medium text-card-foreground text-center text-balance">
              Let Time Work for You
            </h2>
          </div>
          <p className="text-sm text-muted-foreground text-balance text-center max-w-md mx-auto">
            Daily encrypted backups. Auto-generated sitemaps. Your work stays
            findable.
          </p>
          <a
            className="text-sm text-primary hover:underline underline-offset-4 transition-colors hover:text-secondary-foreground"
            href="#"
          >
            Learn more &gt;
          </a>
        </div>
      </div>
    </Section>
  );
}
