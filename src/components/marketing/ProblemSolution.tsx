import { CheckCircle, X } from "lucide-react";
import { useEffect, useRef } from "react";

const ProblemSolution = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            target.style.opacity = "1";

            if (target.classList.contains("animate-on-scroll")) {
              if (target.dataset.animation === "fade-in") {
                target.classList.add("animate-fade-in");
              } else if (target.dataset.animation === "slide-in") {
                target.classList.add("animate-slide-in");
              } else if (target.dataset.animation === "scale-in") {
                target.classList.add("animate-scale-in");
              }
            }

            observer.unobserve(target);
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe section elements
    elementsRef.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Set refs for animations
  const addToRefs = (el: HTMLElement | null) => {
    if (el && !elementsRef.current.includes(el)) {
      elementsRef.current.push(el);
    }
  };

  return (
    <section
      id="problem-solution"
      ref={sectionRef}
      className="py-16 md:py-24 px-6 md:px-12 bg-gray-50/50"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span
            className="bg-navy/5 text-navy px-3 py-1 rounded-full text-sm font-medium animate-on-scroll opacity-0"
            ref={addToRefs}
            data-animation="fade-in"
          >
            Why Inscribe.so?
          </span>

          <h2
            className="text-3xl md:text-4xl font-bold mt-4 mb-6 text-navy animate-on-scroll opacity-0"
            ref={addToRefs}
            data-animation="fade-in"
          >
            The Internet Forgets.{" "}
            <span className="text-copper">Your Ideas Shouldn't.</span>
          </h2>

          <p
            className="text-navy/70 max-w-2xl mx-auto animate-on-scroll opacity-0"
            ref={addToRefs}
            data-animation="fade-in"
          >
            In today's digital landscape, valuable insights get lost in the
            noise. Inscribe provides a permanent home for your words.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h3
              className="text-2xl font-semibold mb-6 animate-on-scroll opacity-0"
              ref={addToRefs}
              data-animation="fade-in"
            >
              The Current Reality
            </h3>

            <div
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4 animate-on-scroll opacity-0 hover:shadow-md transition-shadow duration-300"
              ref={addToRefs}
              data-animation="slide-in"
            >
              <div className="bg-red-100 p-2 rounded-full">
                <X className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <h4 className="font-medium text-navy mb-1">
                  Social media posts disappear
                </h4>
                <p className="text-navy/70 text-sm">
                  Viral today, forgotten tomorrow. The algorithm moves on,
                  leaving your insights behind.
                </p>
              </div>
            </div>

            <div
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4 animate-on-scroll opacity-0 hover:shadow-md transition-shadow duration-300 delay-100"
              ref={addToRefs}
              data-animation="slide-in"
            >
              <div className="bg-red-100 p-2 rounded-full">
                <X className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <h4 className="font-medium text-navy mb-1">
                  Medium & Substack build their brand, not yours
                </h4>
                <p className="text-navy/70 text-sm">
                  Your content lives on someone else's platform, under their
                  domain, building their audience.
                </p>
              </div>
            </div>

            <div
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4 animate-on-scroll opacity-0 hover:shadow-md transition-shadow duration-300 delay-200"
              ref={addToRefs}
              data-animation="slide-in"
            >
              <div className="bg-red-100 p-2 rounded-full">
                <X className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <h4 className="font-medium text-navy mb-1">
                  WordPress is overwhelming
                </h4>
                <p className="text-navy/70 text-sm">
                  Too many features, plugins, and settings. Writing gets lost in
                  website management.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <h3
              className="text-2xl font-semibold mb-6 animate-on-scroll opacity-0"
              ref={addToRefs}
              data-animation="fade-in"
            >
              How Inscribe Fixes This
            </h3>

            <div
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4 animate-on-scroll opacity-0 hover:shadow-md transition-shadow duration-300"
              ref={addToRefs}
              data-animation="slide-in"
            >
              <div className="bg-green-100 p-2 rounded-full">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <h4 className="font-medium text-navy mb-1">
                  Own your domain & content
                </h4>
                <p className="text-navy/70 text-sm">
                  Your writing, your brand. Publish on your custom domain while
                  we handle the technical details.
                </p>
              </div>
            </div>

            <div
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4 animate-on-scroll opacity-0 hover:shadow-md transition-shadow duration-300 delay-100"
              ref={addToRefs}
              data-animation="slide-in"
            >
              <div className="bg-green-100 p-2 rounded-full">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <h4 className="font-medium text-navy mb-1">
                  Minimal, elegant writing experience
                </h4>
                <p className="text-navy/70 text-sm">
                  Focus on words, not widgets. A distraction-free environment
                  designed for quality writing.
                </p>
              </div>
            </div>

            <div
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4 animate-on-scroll opacity-0 hover:shadow-md transition-shadow duration-300 delay-200"
              ref={addToRefs}
              data-animation="slide-in"
            >
              <div className="bg-green-100 p-2 rounded-full">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <h4 className="font-medium text-navy mb-1">
                  Your insights live on forever
                </h4>
                <p className="text-navy/70 text-sm">
                  Designed for longevity. No algorithms, no engagement
                  farming—just pure, lasting writing.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-200">
          <div
            className="overflow-x-auto pb-4 animate-on-scroll opacity-0"
            ref={addToRefs}
            data-animation="fade-in"
          >
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="text-left py-4 px-4 font-medium text-navy bg-white rounded-tl-lg"></th>
                  <th className="py-4 px-4 font-medium text-navy/70 bg-white">
                    Social Media
                  </th>
                  <th className="py-4 px-4 font-medium text-navy/70 bg-white">
                    Medium/Substack
                  </th>
                  <th className="py-4 px-4 font-medium text-navy/70 bg-white">
                    WordPress
                  </th>
                  <th className="py-4 px-4 font-medium text-copper bg-navy-light text-white rounded-tr-lg">
                    Inscribe.so
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-left py-4 px-4 font-medium text-navy bg-white">
                    Own Your Domain
                  </td>
                  <td className="py-4 px-4 text-center bg-white">
                    <X className="h-5 w-5 text-red-500 mx-auto" />
                  </td>
                  <td className="py-4 px-4 text-center bg-white">
                    <X className="h-5 w-5 text-red-500 mx-auto" />
                  </td>
                  <td className="py-4 px-4 text-center bg-white">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                  <td className="py-4 px-4 text-center bg-navy/5">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="text-left py-4 px-4 font-medium text-navy bg-white">
                    Simple Setup
                  </td>
                  <td className="py-4 px-4 text-center bg-white">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                  <td className="py-4 px-4 text-center bg-white">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                  <td className="py-4 px-4 text-center bg-white">
                    <X className="h-5 w-5 text-red-500 mx-auto" />
                  </td>
                  <td className="py-4 px-4 text-center bg-navy/5">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="text-left py-4 px-4 font-medium text-navy bg-white">
                    Distraction-Free Writing
                  </td>
                  <td className="py-4 px-4 text-center bg-white">
                    <X className="h-5 w-5 text-red-500 mx-auto" />
                  </td>
                  <td className="py-4 px-4 text-center bg-white">
                    <X className="h-5 w-5 text-red-500 mx-auto" />
                  </td>
                  <td className="py-4 px-4 text-center bg-white">
                    <X className="h-5 w-5 text-red-500 mx-auto" />
                  </td>
                  <td className="py-4 px-4 text-center bg-navy/5">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="text-left py-4 px-4 font-medium text-navy bg-white rounded-bl-lg">
                    SEO & Long-Term Discoverability
                  </td>
                  <td className="py-4 px-4 text-center bg-white">
                    <X className="h-5 w-5 text-red-500 mx-auto" />
                  </td>
                  <td className="py-4 px-4 text-center bg-white">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                  <td className="py-4 px-4 text-center bg-white">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                  <td className="py-4 px-4 text-center bg-navy/5 rounded-br-lg">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;
