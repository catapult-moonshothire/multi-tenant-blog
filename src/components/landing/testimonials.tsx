import { cn } from "@/lib/utils";
import { Section } from "../layout/section";
import { GridPattern } from "../ui/grid-pattern";

export default function Testimonials() {
  return (
    <Section className="grid divide-y sm:grid-cols-2 sm:divide-x sm:divide-y-0">
      <div className="col-span-2 bg-background relative p-8 flex justify-center items-center  ">
        <GridPattern
          width={20}
          height={20}
          x={-1}
          y={-3}
          className={cn(
            "[mask-image:linear-gradient(to_bottom,white,transparent,transparent)] "
          )}
        />
        <h2 className="font-bold text-2xl text-center tracking-tight sm:text-3xl">
          For People Who Ship
        </h2>
      </div>
      <div className="border-t col-span-2">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-0 lg:bg-grid-3 border-r pb-24 sm:bg-grid-2 relative bg-grid-1">
          <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-2/6 w-[calc(100%-2px)] overflow-hidden bg-gradient-to-t from-background to-transparent" />

          <div className="flex flex-col border-b break-inside-avoid border-l transition-colors hover:bg-secondary/20">
            <div className="px-4 py-5 sm:p-6 flex-grow">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D"
                  alt="Priya"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-medium text-foreground">
                    Priya, CTO
                  </h3>
                  <p>@DevOps SaaS</p>
                </div>
              </div>
              <p>
                "I've moved my startup's entire technical blog here. It's now
                our hiring funnel."
              </p>
            </div>
          </div>
          <div className="flex flex-col border-b break-inside-avoid border-l transition-colors hover:bg-secondary/20">
            <div className="px-4 py-5 sm:p-6 flex-grow">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHBvcnRyYWl0fGVufDB8fDB8fHww"
                  alt="Marcus"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-medium text-foreground">
                    Marcus,
                  </h3>
                  <p>Founder</p>
                </div>
              </div>
              <p>
                "My 2018 'Why No-Code Will Fail' essay still drives consulting
                leads. Zero maintenance."
              </p>
            </div>
          </div>
          <div className="flex flex-col border-b break-inside-avoid border-l transition-colors hover:bg-secondary/20">
            <div className="px-4 py-5 sm:p-6 flex-grow">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHBvcnRyYWl0fGVufDB8fDB8fHww"
                  alt="Alex"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-medium text-foreground">Alex,</h3>
                  <p>Engineer-Turned-Founder</p>
                </div>
              </div>

              <p>
                "Finally, a tool that treats my writing like code—versioned,
                owned, and deployable."
              </p>
            </div>
          </div>
          <div className="flex flex-col border-b break-inside-avoid border-l transition-colors hover:bg-secondary/20 hidden">
            <div className="px-4 py-5 sm:p-6 flex-grow">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjR8fHBvcnRyYWl0fGVufDB8fDB8fHww"
                  alt="Julia Kim"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-medium text-foreground">
                    Julia Kim
                  </h3>
                  <p className="text-sm text-muted-foreground">DevAI</p>
                </div>
              </div>
              <p>
                "The Inscribe's documentation and support have made our learning
                curve much smoother."
              </p>
            </div>
          </div>
          <div className="flex flex-col border-b break-inside-avoid border-l transition-colors hover:bg-secondary/20 hidden">
            <div className="px-4 py-5 sm:p-6 flex-grow">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzB8fHBvcnRyYWl0fGVufDB8fDB8fHww"
                  alt="Kevin Lee"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-medium text-foreground">
                    Kevin Lee
                  </h3>
                  <p className="text-sm text-muted-foreground">DecisionTech</p>
                </div>
              </div>
              <p>
                "We've seen a significant boost in our AI's decision-making
                capabilities thanks to the Inscribe."
              </p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
