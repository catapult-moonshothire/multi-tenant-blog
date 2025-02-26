import { Section } from "../layout/section";

export default function Section8() {
  return (
    <Section className="grid divide-y sm:grid-cols-2 sm:divide-x sm:divide-y-0">
      <div className="col-span-2 p-8 flex justify-center items-center  ">
        <h2 className="font-bold text-2xl text-center tracking-tight sm:text-3xl">
          For the Skeptics:{" "}
        </h2>
      </div>
      <div className="grid md:grid-cols-2 divide-x col-span-2">
        <div className="sm:p-4 ">
          <div className="p-4 sm:border bg-background hover:shadow transition-all duration-300 space-y-4 !pt-16">
            <h3 className="font-semibold text-2xl tracking-tight">
              What if I leave?
            </h3>
            <div>
              <p>Export all posts with one click.</p>
            </div>
          </div>
        </div>
        <div className="sm:p-4 ">
          <div className="p-4 sm:border bg-background hover:shadow transition-all duration-300 space-y-4 !pt-16">
            <h3 className="font-semibold text-2xl tracking-tight">
              What if you shut down?
            </h3>
            <div>
              <p>We'll open-source the code.</p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
