import { Section } from "../layout/section";

export default function Section2() {
  return (
    <Section className="grid divide-y sm:grid-cols-2 sm:divide-x sm:divide-y-0">
      <div className="col-span-2 p-8 flex justify-center items-center  ">
        <h2 className="font-bold text-2xl text-center tracking-tight sm:text-3xl">
          We've All Lost Work to the Internet's Short Memory
        </h2>
      </div>
      <div className="grid md:grid-cols-2 divide-x col-span-2">
        <div className="sm:p-4 ">
          <div className="p-4 sm:border bg-background space-y-4 !pt-16">
            <h3 className="font-semibold text-2xl tracking-tight">
              Your essays, technical guides, and founder stories are your
              legacy. But today:
            </h3>
            <div>
              <p>Medium owns your SEO</p>
              <p>LinkedIn buries posts in days</p>
              <p>Self-hosting feels like maintaining a second product</p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-dashed">
          <div className="sm:p-4 h-full space-y-4 !pt-16">
            <div className="">
              <div className="relative flex flex-col items-center border border-primary/70">
                <div className="absolute -left-1.5 -top-1.5 h-3 w-3 bg-primary/70 text-white" />
                <div className="absolute -bottom-1.5 -left-1.5 h-3 w-3 bg-primary/70 text-white" />
                <div className="absolute -right-1.5 -top-1.5 h-3 w-3 bg-primary/70 text-white" />
                <div className="absolute -bottom-1.5 -right-1.5 h-3 w-3 bg-primary/70 text-white" />

                <div className="relative z-20 mx-auto  bg-background p-6">
                  <p className="md:text-md text-xs text-primary/70 lg:text-lg ">
                    I believe
                  </p>

                  <h3 className="font-semibold text-2xl tracking-tight">
                    You shouldn&apos;t need a DevOps team to preserve your
                    ideas.
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
