import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Section } from "../layout/section";
import { ReserveSpotForm } from "./reserve-spot-form";

export default function Hero() {
  return (
    <>
      <Section id="hero">
        <div className="relative bg-dashed">
          <div className="relative grid grid-cols-1  gap-x-8 w-full sm:p-6  overflow-hidden">
            <div className="flex flex-col justify-center min-h-[80vh]  bg-background p-6 lg:p-8 !py-12 lg:!py-20 border size-full gap-8 items-start lg:col-span-1">
              <Link
                href="https://abhinavbaldha.com/blog/building-inscribe"
                target="_blank"
                className="px-8 py-0.5 group pb-1 flex items-center justify-center relative border-2 border-black dark:border-white uppercase bg-white text-black transition duration-200 text-sm shadow-[1px_1px_rgba(0,0,0),2px_2px_rgba(0,0,0),3px_3px_rgba(0,0,0),2px_2px_rgba(0,0,0),2px_2px_0px_0px_rgba(0,0,0)] hover:shadow-none hover:translate-y-0.5 hover:translate-x-0.5"
              >
                Introducing Inscribe
                <ChevronRight
                  size={16}
                  className="pt-0.5 group-hover:translate-x-2 transition-all duration-300"
                />
              </Link>

              <div className="flex w-full max-w-3xl flex-col space-y-4 overflow-hidden pt-8">
                <h1 className="text-left text-4xl font-semibold leading-tighter text-foreground space-y-4 sm:text-5xl md:text-6xl tracking-tighter">
                  <span className="inline-block text-balance">
                    <span className="relative leading-none overflow-hidden inline-flex  ">
                      Your Ideas Deserve a Permanent Address{" "}
                    </span>
                  </span>
                </h1>
                <p className="text-left max-w-xl leading-normal text-muted-foreground sm:text-lg sm:leading-normal text-balance">
                  A platform for thoughtful builders.
                  <br /> Write, publish, and own your work on your domain—no
                  algorithms, no lock-in, no expiry dates.
                </p>
              </div>
              <div className="relative mt-6">
                <div
                  className="flex w-full max-w-2xl flex-col items-start justify-start space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0"
                  style={{ opacity: 1, willChange: "auto", transform: "none" }}
                >
                  <ReserveSpotForm />
                </div>
                <p
                  className="mt-3 text-sm text-muted-foreground text-left"
                  style={{ opacity: 1, willChange: "auto" }}
                >
                  Free forever for early adopters. No credit card needed.{" "}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
