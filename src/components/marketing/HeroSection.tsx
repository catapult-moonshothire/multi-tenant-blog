import { ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";

const HeroSection = () => {
  const revealRefs = useRef<(HTMLElement | null)[]>([]);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            if (target.classList.contains("reveal-text")) {
              target.classList.add("animate");
            } else if (target.classList.contains("image-reveal")) {
              target.classList.add("animate");
            } else {
              target.style.opacity = "1";
              target.classList.add("animate-fade-in");
            }
            observer.unobserve(target);
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe all reveal elements
    revealRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    // Observe image
    if (imageRef.current) observer.observe(imageRef.current);

    return () => observer.disconnect();
  }, []);

  // Set refs for animations
  const addToRefs = (el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  return (
    <section
      id="home"
      className="pt-32 pb-20 md:pt-40 md:pb-28 px-6 md:px-12 max-w-7xl mx-auto relative"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 max-w-full mx-auto">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-copper/10 rounded-full blur-3xl opacity-70"></div>
        <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-copper/5 rounded-full blur-3xl opacity-60"></div>
      </div>

      <div className="relative z-10 grid md:grid-cols-2 gap-10 md:gap-6 items-center">
        <div className="order-2 md:order-1">
          <div className="mb-3 inline-block" ref={addToRefs}>
            <span className="bg-navy/5 text-navy-light px-3 py-1 rounded-full text-sm font-medium">
              Minimal. Elegant. Yours.
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-navy text-balance">
            <div
              className="reveal-text-container overflow-hidden mb-2"
              ref={addToRefs}
            >
              <div className="reveal-text" ref={addToRefs}>
                <span className="inline-block">Own Your Words.</span>
              </div>
            </div>
            <div
              className="reveal-text-container overflow-hidden mb-2"
              ref={addToRefs}
            >
              <div className="reveal-text pb-3" ref={addToRefs}>
                <span className="inline-block text-copper">
                  Build Your Legacy.
                </span>
              </div>
            </div>
          </h1>

          <p
            className="text-navy/80 text-lg mb-8 max-w-xl animate-on-scroll"
            ref={addToRefs}
          >
            A distraction-free blogging platform for CEOs, founders, and thought
            leaders to write on their own domain and ensure their insights live
            forever.
          </p>

          <div
            className="flex flex-wrap gap-4 mb-8 animate-on-scroll"
            ref={addToRefs}
          >
            <a
              href="https://inscribe.so/register"
              target="_blank"
              rel="noopener noreferrer"
              className="premium-button flex items-center gap-2 bg-navy text-offwhite px-6 py-3 rounded-md text-base font-medium hover:bg-navy-light"
            >
              Start Writing <ArrowRight size={18} />
            </a>
            {/* <a
              href="#features"
              className="flex items-center gap-2 bg-transparent text-navy border border-navy/20 px-6 py-3 rounded-md text-base font-medium hover:bg-navy/5 transition-colors duration-300"
            >
              See a Demo <ArrowRight size={18} />
            </a> */}
          </div>
        </div>

        {/* <div className="order-1 md:order-2 image-container">
          <div
            ref={imageRef}
            className="image-reveal relative p-1 bg-gradient-to-tr from-transparent via-copper/20 to-transparent rounded-2xl overflow-hidden"
          >
            <div className="bg-white rounded-xl overflow-hidden shadow-xl">
              <img
                src="https://placehold.co/600x400/f8fafc/1e293b?text=Inscribe.so+Editor"
                alt="Inscribe.so writing interface"
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-copper/10 backdrop-blur-xl rounded-lg rotate-12 z-10"></div>
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-navy/10 backdrop-blur-xl rounded-lg -rotate-12 z-10"></div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default HeroSection;
