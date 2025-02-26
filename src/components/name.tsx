import { HEADER_TITLE } from "@/lib/constants";
import { capitalizeFirstLetter } from "@/lib/helper";
import { User } from "@/lib/types";
import Link from "next/link";

interface NameTransitionProps {
  userData: User;
}

export function NameTransition({ userData }: NameTransitionProps) {
  // Set default values in case userData fields are undefined
  const defaultFirstName = "Abhinav";
  const defaultLastName = "Baldha";

  // Use default values if userData fields are missing
  const fullName = `${capitalizeFirstLetter(
    userData?.firstName || defaultFirstName
  )} ${capitalizeFirstLetter(userData?.lastName || defaultLastName)}`;

  return (
    <Link
      href={userData?.subdomain ? `/${userData.subdomain}` : "/"}
      className="text-3xl sm:text-4xl pb-2  font-bold transition-element"
    >
      <span className="sr-only">{`${defaultFirstName} ${defaultLastName}`}</span>
      <span aria-hidden="true" className="block  group relative">
        {/* <span className="inline-block transition-all duration-300 ease-in-out group-hover:-translate-y-full"> */}
        {fullName ||
          HEADER_TITLE.split("").map((letter, index) => (
            <span
              key={index}
              className="inline-block"
              style={{ transitionDelay: `${index * 25}ms` }}
            >
              {letter === " " ? "\u00A0" : letter}
            </span>
          ))}
        {/* </span> */}
        {/* <span className="inline-block absolute left-0 top-0 transition-all duration-300 ease-in-out translate-y-full group-hover:-translate-y-0">
          {capitalizeFirstLetter(userData?.firstName || defaultFirstName) ||
            HEADER_TITLE.split("").map((letter, index) => (
              <span
                key={index}
                className="inline-block"
                style={{ transitionDelay: `${index * 25}ms` }}
              >
                {letter}
              </span>
            ))}
        </span> */}
      </span>
    </Link>
  );
}
