import { GENERAL_BIO } from "@/lib/constants";
import { LinkedIn, X } from "@/lib/icons";
import { SocialLinks, User } from "@/lib/types";
import { InstagramLogoIcon } from "@radix-ui/react-icons";
import { Facebook, Link, Youtube } from "lucide-react";
import { NameTransition } from "../name";

interface HeaderProps {
  userData: User & SocialLinks;
}

const Header = ({ userData }: HeaderProps) => {
  // Render social icon for each platform
  const renderSocialIcon = (platform: string, url: string) => {
    if (!url) return null;

    let icon;
    switch (platform) {
      case "twitter":
      case "x":
        icon = <X className="size-4" />;
        break;
      case "linkedin":
        icon = <LinkedIn className="size-4" />;
        break;
      case "facebook":
        icon = <Facebook className="size-4" />;
        break;
      case "instagram":
        icon = <InstagramLogoIcon className="size-4" />;
        break;
      case "youtube":
        icon = <Youtube className="size-4" />;
        break;
      case "tiktok":
        icon = (
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4"
          >
            <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
          </svg>
        );
        break;
      default:
        icon = <Link className="size-4" />;
    }

    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-600 hover:text-gray-900 transition-colors"
        aria-label={`${platform} profile`}
      >
        {icon}
      </a>
    );
  };

  // Create an array of social media platforms with their corresponding URLs
  const socialLinks = [
    { platform: "twitter", url: userData.twitter },
    { platform: "instagram", url: userData.instagram },
    { platform: "linkedin", url: userData.linkedin },
    { platform: "youtube", url: userData.youtube },
    { platform: "tiktok", url: userData.tiktok },
    { platform: "extraLink", url: userData.extraLink },
  ];

  return (
    <header className="mb-6 max-w-4xl mx-auto px-4 pt-12 sm:px-8 sm:mb-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <div className="mb-4 md:mb-0">
          <NameTransition userData={userData} />
          <p className="text-gray-600 mt-2">
            {userData?.headline || GENERAL_BIO}
          </p>
          <p className="text-gray-500 text-sm mt-1">
            {userData?.bio || GENERAL_BIO}
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end">
          <div className="flex space-x-2 mt-2">
            {/* Render only the social media icons with available URLs */}
            {socialLinks.map(
              ({ platform, url }) => url && renderSocialIcon(platform, url) // Only render if the URL exists
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
