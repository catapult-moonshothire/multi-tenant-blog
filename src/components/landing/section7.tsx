import { Section } from "../layout/section";

export default function Section7() {
  return (
    <>
      <Section id="hero">
        <div className="relative   bg-dashed">
          <div className="relative grid grid-cols-1 gap-x-8 w-full text-center sm:p-6 overflow-hidden">
            <div className="flex flex-col justify-start bg-background p-6 lg:p-8 border size-full items-start lg:col-span-1">
              <div className="flex w-full flex-col space-y-4 overflow-hidden pt-8">
                <h2 className="text-center text-3xl font-semibold leading-tighter text-foreground space-y-2 sm:text-4xl tracking-tighter">
                  <span
                    className="inline-block text-balance"
                    style={{
                      opacity: 1,
                      willChange: "auto",
                      transform: "none",
                    }}
                  >
                    <span className="relative max-w-2xl leading-none overflow-hidden inline-flex  ">
                      Write for the Founder Who Needs Your Advice in 2043{" "}
                    </span>
                  </span>
                </h2>
                <p className="text-center text-muted-foreground sm:text-lg text-balance">
                  The best ideas aren't urgent.
                </p>
                <p className="text-center text-muted-foreground sm:text-lg text-balance">
                  They're patient.
                </p>
                <p className="text-center text-muted-foreground sm:text-lg text-balance">
                  They compound.{" "}
                </p>
                <p className="text-center text-muted-foreground sm:text-lg text-balance">
                  Start building your archive. We'll keep the lights on.{" "}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
