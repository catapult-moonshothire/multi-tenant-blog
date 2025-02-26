import { Section } from "../layout/section";
import { ReserveSpotForm2 } from "./reserve-spot-form2";

export default function Section6() {
  return (
    <Section className="grid divide-y sm:grid-cols-2 sm:divide-x sm:divide-y-0">
      <div className="col-span-2 p-8 flex justify-center items-center  ">
        <h2 className="font-bold text-2xl text-center tracking-tight sm:text-3xl">
          Early Spots Are Limited. Reserve Yours.
        </h2>
      </div>
      <div className="grid divide-x md:grid-cols-2 col-span-2">
        <div className="sm:p-4 ">
          <div className="p-4 sm:border bg-background space-y-4 !pt-16">
            <h3 className="font-semibold text-2xl tracking-tight">
              What You Get:
            </h3>
            <div>
              <p>Free forever: Your domain, monthly backups, RSS</p>
              <p>1 year free Premium: Daily backups, SEO tools, analytics</p>
              <p>No lock-in: Export all data anytime</p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-dashed">
          <div className="sm:p-4 h-full space-y-4 ">
            <div className="">
              <div className="relative flex flex-col items-center border border-primary/70">
                <div className="absolute -left-1.5 -top-1.5 h-3 w-3 bg-primary/70 text-white" />
                <div className="absolute -bottom-1.5 -left-1.5 h-3 w-3 bg-primary/70 text-white" />
                <div className="absolute -right-1.5 -top-1.5 h-3 w-3 bg-primary/70 text-white" />
                <div className="absolute -bottom-1.5 -right-1.5 h-3 w-3 bg-primary/70 text-white" />

                <div className="relative z-20 w-full space-y-2 bg-background p-6">
                  <p className="md:text-md text-xs text-primary/70  ">
                    427/500 spots reserved
                  </p>

                  <ReserveSpotForm2 />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
