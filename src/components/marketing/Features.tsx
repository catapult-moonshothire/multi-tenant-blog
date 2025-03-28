import { Archive, CheckCircle, Edit, Globe, Search } from "lucide-react";
import { useEffect, useRef } from "react";

const Features = () => {
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

  const features = [
    {
      icon: <Edit className="h-7 w-7 text-copper" />,
      title: "Minimal UI for Deep Focus",
      description:
        "A clean, distraction-free interface designed for writing, not tweaking settings.",
      delay: "delay-0",
    },
    {
      icon: <Globe className="h-7 w-7 text-copper" />,
      title: "Custom Domain Support",
      description:
        "Build your personal brand by publishing on your own domain.",
      delay: "delay-100",
    },
    {
      icon: <Search className="h-7 w-7 text-copper" />,
      title: "SEO & Long-Term Discoverability",
      description:
        "Your words won't just be read today—they'll be searchable and valuable for decades.",
      delay: "delay-200",
    },
    {
      icon: <Archive className="h-7 w-7 text-copper" />,
      title: "Content That Lives Forever",
      description:
        "No algorithms, no engagement farming—just pure, lasting writing.",
      delay: "delay-300",
    },
    {
      icon: <CheckCircle className="h-7 w-7 text-copper" />,
      title: "Simple Publishing Workflow",
      description: "No complex dashboards or plugins. Just write and publish.",
      delay: "delay-400",
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="features"
      className="py-16 md:py-24 px-6 md:px-12 max-w-7xl mx-auto"
    >
      <div className="text-center mb-16">
        <span
          className="bg-navy/5 text-navy px-3 py-1 rounded-full text-sm font-medium animate-on-scroll opacity-0"
          ref={addToRefs}
        >
          Key Features
        </span>

        <h2
          className="text-3xl md:text-4xl font-bold mt-4 mb-6 text-navy animate-on-scroll opacity-0"
          ref={addToRefs}
        >
          A Writing Experience That{" "}
          <span className="text-copper">Feels Effortless</span>
        </h2>

        <p
          className="text-navy/70 max-w-2xl mx-auto animate-on-scroll opacity-0"
          ref={addToRefs}
        >
          Every aspect of Inscribe is designed to let you focus on what matters
          most: your words.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`feature-card glass-card p-8 rounded-xl bg-white border border-gray-100 animate-on-scroll opacity-0 ${feature.delay}`}
            ref={addToRefs}
          >
            <div className="bg-navy/5 p-3 inline-block rounded-lg mb-5">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
            <p className="text-navy/70">{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 pt-12 grid md:grid-cols-2 gap-12">
        <div className="animate-on-scroll opacity-0" ref={addToRefs}>
          <h3 className="text-2xl font-semibold mb-6">
            A platform that grows with you
          </h3>
          <p className="text-navy/70 mb-6">
            Whether you're writing occasional insights or building a
            comprehensive knowledge base, Inscribe scales to match your
            ambitions.
          </p>

          <ul className="space-y-3">
            {[
              "Analytics that respect privacy",
              "Seamless custom domain setup",
              "Automatic backups for peace of mind",
              "Export options to prevent lock-in",
              "SEO optimization without the complexity",
            ].map((item, index) => (
              <li key={index} className="flex items-center gap-3">
                <div className="min-w-5">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* <div
          className="bg-navy p-1 rounded-2xl overflow-hidden animate-on-scroll opacity-0"
          ref={addToRefs}
        >
          <div className="bg-white rounded-xl overflow-hidden">
            <img
              src="https://placehold.co/600x400/f8fafc/1e293b?text=Inscribe.so+Dashboard"
              alt="Inscribe.so dashboard"
              className="w-full h-auto"
            />
          </div>
        </div> */}
      </div>

      <div className="mt-16 pt-6 text-center">
        <div
          className="inline-block bg-navy/5 hover:bg-navy/10 transition-colors duration-200 p-8 rounded-xl animate-on-scroll opacity-0"
          ref={addToRefs}
        >
          <h3 className="text-xl font-semibold mb-2">
            Ready to experience truly distraction-free writing?
          </h3>
          <p className="text-navy/70">
            Join the writers who are building their legacy, one post at a time.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Features;
