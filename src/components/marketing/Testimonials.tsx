import { useEffect, useRef } from "react";

const testimonials = [
  {
    quote: "Inscribe.so lets me focus on writing, not managing a website.",
    author: "Sarah Johnson",
    title: "CEO, TechVision",
    delay: "delay-0",
  },
  {
    quote:
      "Finally, a platform where my insights won't disappear in an algorithm.",
    author: "Michael Chen",
    title: "Founder, StrategyLabs",
    delay: "delay-100",
  },
  {
    quote:
      "The cleanest writing experience I've found. It's like writing on paper but better.",
    author: "David Torres",
    title: "Author & Entrepreneur",
    delay: "delay-200",
  },
];

const Testimonials = () => {
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
    <section
      id="testimonials"
      ref={sectionRef}
      className="py-16 md:py-24 px-6 md:px-12 bg-navy"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span
            className="bg-white/10 text-white px-3 py-1 rounded-full text-sm font-medium animate-on-scroll opacity-0"
            ref={addToRefs}
          >
            Testimonials
          </span>

          <h2
            className="text-3xl md:text-4xl font-bold mt-4 mb-6 text-white animate-on-scroll opacity-0"
            ref={addToRefs}
          >
            What <span className="text-copper">Thought Leaders</span> Are Saying
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`testimonial-card bg-navy-light backdrop-blur-lg p-8 rounded-xl border border-white/10 animate-on-scroll opacity-0 ${testimonial.delay}`}
              ref={addToRefs}
            >
              <svg
                className="h-8 w-8 text-copper mb-4 opacity-70"
                fill="currentColor"
                viewBox="0 0 32 32"
              >
                <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
              </svg>
              <p className="text-white/90 mb-6 text-lg">{testimonial.quote}</p>
              <div className="flex items-center">
                <div className="bg-copper/20 h-10 w-10 rounded-full flex items-center justify-center mr-3">
                  <span className="text-copper font-medium text-sm">
                    {testimonial.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-white font-medium">{testimonial.author}</p>
                  <p className="text-white/60 text-sm">{testimonial.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-8 animate-on-scroll opacity-0"
          ref={addToRefs}
        >
          {["TechVision", "StrategyLabs", "FutureThink", "InnovateNow"].map(
            (company, index) => (
              <div key={index} className="text-center">
                <p className="text-white/80 text-lg font-semibold">{company}</p>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
