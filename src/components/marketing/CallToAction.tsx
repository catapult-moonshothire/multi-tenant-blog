import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";

const CallToAction = () => {
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
              target.classList.add("animate-fade-in");
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
    <section ref={sectionRef} className="py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-5xl mx-auto bg-gradient-to-br from-navy to-navy-light rounded-2xl overflow-hidden p-1">
        <div className="bg-gradient-to-br from-navy to-navy-light rounded-xl p-10 md:p-16 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-copper/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-copper/5 rounded-full blur-3xl"></div>

          <div className="relative z-10 text-center">
            <span
              className="inline-block bg-white/10 text-white px-3 py-1 rounded-full text-sm font-medium mb-6 animate-on-scroll opacity-0"
              ref={addToRefs}
            >
              Get Started Today
            </span>

            <h2
              className="text-3xl md:text-4xl font-bold mb-6 text-white animate-on-scroll opacity-0"
              ref={addToRefs}
            >
              Write Without Distractions. <br />
              <span className="text-copper">Publish Without Limits.</span>
            </h2>

            <p
              className="text-white/80 max-w-2xl mx-auto mb-8 animate-on-scroll opacity-0"
              ref={addToRefs}
            >
              Join the writers who are building their legacy, one post at a
              time.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4 justify-center mb-8 animate-on-scroll opacity-0"
              ref={addToRefs}
            >
              <Link
                href="/register"
                className="premium-button bg-white text-navy px-6 py-3 rounded-md text-base font-medium flex items-center justify-center gap-2 hover:bg-white/90"
              >
                Start Writing <ArrowRight size={18} />
              </Link>
              {/* <Link
                href="/"
                className="bg-transparent text-white border border-white/20 px-6 py-3 rounded-md text-base font-medium hover:bg-white/5 transition-colors duration-300 flex items-center justify-center gap-2"
              >
                See a Demo <ArrowRight size={18} />
              </Link> */}
            </div>

            <div
              className="pt-8 border-t border-white/10 text-white/60 text-sm animate-on-scroll opacity-0"
              ref={addToRefs}
            >
              No credit card required. Get started with our free plan.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
