export function formatDate(input: string | number): string {
  const date = new Date(input);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export const isNewPost = (created_at: string) => {
  const postDate = new Date(created_at);
  const currentDate = new Date();
  const differenceInDays =
    (currentDate.getTime() - postDate.getTime()) / (1000 * 3600 * 24);
  return differenceInDays <= 30;
};

export const handleError = (error: any, toast: any) => {
  const message = error?.message || "An unexpected error occurred";
  console.error(error);
  toast({
    variant: "destructive",
    title: "Error",
    description: message,
  });
};

export const capitalizeFirstLetter = (name: string) => {
  return name?.charAt(0)?.toUpperCase() + name?.slice(1)?.toLowerCase();
};

// Helper function to parse social links
export function parseSocialLinks(socialLinks: string): Record<string, string> {
  try {
    // Try parsing as JSON first
    return JSON.parse(socialLinks);
  } catch (error) {
    // If JSON parsing fails, assume it's a comma-separated string
    const links: Record<string, string> = {};
    socialLinks.split(",").forEach((platform) => {
      const trimmedPlatform = platform.trim().toLowerCase();
      links[trimmedPlatform] = ""; // Add empty URL or handle as needed
    });
    return links;
  }
}
