"use client";

import { checkSubdomainAvailability } from "@/app/actions/check-subdomain"; // Import the server action
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation"; // Import useRouter for redirection
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const reserveSpotSchema = z.object({
  subdomain: z
    .string({ message: "Please enter a valid handle address" })
    .min(3, { message: "Subdomain handle must be at least 3 characters long" })
    .regex(/^[a-z0-9-]+$/, {
      message:
        "Subdomain can only contain lowercase letters, numbers, and hyphens",
    }),
});

export const ReserveSpotForm = () => {
  const router = useRouter(); // Initialize the router
  const [showMessage, setShowMessage] = useState(false); // State for success message
  const [error, setError] = useState(""); // State for error message
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false); // State for loading

  const form = useForm<z.infer<typeof reserveSpotSchema>>({
    resolver: zodResolver(reserveSpotSchema),
    defaultValues: {
      subdomain: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof reserveSpotSchema>) => {
    setIsCheckingAvailability(true); // Start loading
    setShowMessage(false); // Reset success/error message before making the request

    try {
      // Call the server action to check subdomain availability
      const result = await checkSubdomainAvailability(values.subdomain);
      console.log("result", result);

      if (result.success) {
        // Subdomain is available
        setShowMessage(true); // Show success message
        toast.success("Subdomain is available! Redirecting to registration...");

        // Redirect to the /register page after 2 seconds
        setTimeout(() => {
          router.push(`/register?subdomain=${values.subdomain}`);
        }, 2000);
      } else {
        // Subdomain is not available
        setError(result.message);
        toast.error(result.message);

        // Don't show the success message, just the error
        setShowMessage(true); // Show error message
      }
    } catch (error) {
      console.error("Error checking subdomain availability:", error);
      toast.error("An error occurred. Please try again.");

      // Set error and show error message
      setError("An error occurred. Please try again.");
      setShowMessage(true);
    } finally {
      setIsCheckingAvailability(false); // Stop loading
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="relative ">
          <FormField
            control={form.control}
            name="subdomain"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel className="sr-only">Subdomain Handle</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      id="subdomain"
                      className="peer ps-[88px] rounded-none w-[22rem] border border-black sm:w-96"
                      placeholder="your-handle"
                      {...field}
                    />
                    <span className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm peer-disabled:opacity-50">
                      inscribe.so/
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="absolute top-0 right-0 h-auto rounded-none"
            disabled={isCheckingAvailability}
          >
            {isCheckingAvailability ? (
              <span className="flex items-center">
                <LoaderCircle className="animate-spin mr-2" size={16} />
                Checking...
              </span>
            ) : (
              "Reserve Your Spot"
            )}
          </Button>
        </form>
      </Form>

      {/* Success or Error Message */}
      {showMessage && (
        <div className="mt-4 text-sm">
          {error ? (
            <span className="text-red-600">{error}</span>
          ) : (
            <span className="text-green-600">
              Success! Redirecting to registration...
            </span>
          )}
        </div>
      )}
    </div>
  );
};
