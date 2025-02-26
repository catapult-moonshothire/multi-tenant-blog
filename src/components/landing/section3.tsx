import { cn } from "@/lib/utils";
import { Section } from "../layout/section";
import { GridPattern } from "../ui/grid-pattern";

export default function Section3() {
  return (
    <Section className="grid divide-y sm:grid-cols-2 sm:divide-x sm:divide-y-0">
      <div className="col-span-2 size-full relative p-8 bg-background flex justify-center flex-col text-center gap-2 items-center  ">
        <GridPattern
          width={20}
          strokeDasharray={"4 2"}
          height={20}
          x={-1}
          y={-1}
          className={cn(
            "[mask-image:linear-gradient(to_bottom,white,transparent,transparent)] "
          )}
        />

        <h2 className="font-bold text-2xl tracking-tight sm:text-3xl">
          Build a Digital Homestead
        </h2>
        <p className="p-4 border bg-dashed sm:px-8">
          yourname.com/lessons-from-failing-twice (2008) <br />
          yourname.com/why-we-pivoted-to-ai (2032)
        </p>
      </div>
      <div className="grid md:grid-cols-2 divide-x col-span-2">
        <div className="sm:p-4">
          <div className="p-4 sm:border bg-background space-y-4 !pt-16">
            <h3 className="font-semibold text-2xl tracking-tight">Imagine:</h3>
            <div>
              <p>A 2030 investor reading your 2024 essays</p>
              <p>
                Your team's engineering docs staying online decades after your
                exit
              </p>
              <p>
                Your domain becoming a museum of your career—raw, unfiltered,
                undiluted
              </p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-dashed">
          <div className="sm:p-4 h-full space-y-4 !pt-16">
            <div className="my-auto h-full">
              <div className="relative flex flex-col items-center border border-primary/70">
                <div className="absolute -left-1.5 -top-1.5 h-3 w-3 bg-primary/70 text-white" />
                <div className="absolute -bottom-1.5 -left-1.5 h-3 w-3 bg-primary/70 text-white" />
                <div className="absolute -right-1.5 -top-1.5 h-3 w-3 bg-primary/70 text-white" />
                <div className="absolute -bottom-1.5 -right-1.5 h-3 w-3 bg-primary/70 text-white" />

                <div className="relative z-20 mx-auto  bg-background p-6">
                  <q className="font-semibold italic text-2xl tracking-tight">
                    This is for builders who write to think, not to trend.
                  </q>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
