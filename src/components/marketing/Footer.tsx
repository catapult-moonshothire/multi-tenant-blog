import { X } from "@/lib/icons";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-50 py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="text-navy text-xl font-semibold tracking-tight inline-block mb-6"
            >
              Inscribe.so
            </Link>
            <p className="text-navy/70 max-w-xs">
              A distraction-free blogging platform for thought leaders to write
              on their own domain.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-navy mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-navy/70 hover:text-navy transition-colors duration-200"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-navy/70 hover:text-navy transition-colors duration-200"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-navy/70 hover:text-navy transition-colors duration-200"
                >
                  Custom Domains
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-navy/70 hover:text-navy transition-colors duration-200"
                >
                  Analytics
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-navy mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-navy/70 hover:text-navy transition-colors duration-200"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-navy/70 hover:text-navy transition-colors duration-200"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-navy/70 hover:text-navy transition-colors duration-200"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-navy/70 hover:text-navy transition-colors duration-200"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-navy mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-navy/70 hover:text-navy transition-colors duration-200"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-navy/70 hover:text-navy transition-colors duration-200"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-navy/70 hover:text-navy transition-colors duration-200"
                >
                  API
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-navy/70 hover:text-navy transition-colors duration-200"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div> */}

        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-navy/60 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Inscribe.so. All rights reserved.
          </p>

          <div className="flex space-x-2">
            <Link
              href="/"
              className="text-navy/60 hover:text-navy transition-colors duration-200"
            >
              <span className="sr-only">Twitter</span>
              <X className="size-5" />
            </Link>

            <Link
              href="/"
              className="text-navy/60 hover:text-navy transition-colors duration-200"
            >
              <span className="sr-only">GitHub</span>
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>

            <Link
              href="/"
              className="text-navy/60 hover:text-navy transition-colors duration-200"
            >
              <span className="sr-only">LinkedIn</span>
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
