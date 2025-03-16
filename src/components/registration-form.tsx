"use client";

import { useAuth } from "@/components/providers/auth-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { Textarea } from "./ui/textarea";

// Step 1 Schema
const step1Schema = z.object({
  firstName: z
    .string()
    .min(3, { message: "First name is required (min 3 chars)" }),
  lastName: z
    .string()
    .min(3, { message: "Last name is required (min 3 chars)" }),
  blogSubdomain: z
    .string()
    .min(3, "Handle must be at least 3 characters")
    .regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, and hyphens"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// Social Link Schema
const socialLinkSchema = z
  .object({
    platform: z.string().optional(),
    url: z.string().url("Please enter a valid URL").optional(),
  })
  .optional();

// Step 2 Schema
const step2Schema = z.object({
  headline: z.string().max(120, "Headline is required").optional(),
  bio: z.string().max(360).optional(),
  location: z.string().max(25, "Max 25 characters").optional(),
  socialLinks: z
    .array(socialLinkSchema)
    .max(3, "Maximum 3 social links allowed"),
  extraLink: z
    .object({
      url: z.string().url("Please enter a valid URL").optional(),
    })
    .optional(),
});

// Combined Schema
const formSchema = step1Schema.merge(step2Schema);
type FormValues = z.infer<typeof formSchema>;

const SOCIAL_PLATFORMS = [
  { value: "twitter", label: "Twitter" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "youtube", label: "YouTube" },
];

export default function RegistrationForm() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      blogSubdomain: "",
      email: "",
      password: "",
      headline: "",
      bio: "",
      location: "",
      socialLinks: [],
      extraLink: { url: "" },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "socialLinks",
  });

  // Add a new social link if we have less than 3
  const addSocialLink = () => {
    if (fields.length < 3) {
      append({ platform: "", url: "" });
    }
  };

  // Prefill the URL field when platform is selected
  const updateUrlPlaceholder = (index: number, platform: string) => {
    const currentLinks = form.getValues("socialLinks");
    const updatedLinks = [...currentLinks];
    updatedLinks[index] = { ...updatedLinks[index], platform };
    form.setValue("socialLinks", updatedLinks);
  };

  const handleNext = async () => {
    // Validate Step 1 fields
    const isValid = await form.trigger([
      "firstName",
      "lastName",
      "blogSubdomain",
      "email",
      "password",
    ]);
    if (!isValid) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      });
      return;
    }

    // Extract Step 1 data
    const step1Data = form.getValues();

    // Call the validation API
    setLoading(true);
    try {
      const response = await fetch("/api/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: step1Data.email,
          blogSubdomain: step1Data.blogSubdomain,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Proceed to Step 2 if validation is successful
        setStep(2);
      } else {
        // Show error if email or blog handle is already taken
        toast({
          title: "Validation Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during validation",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      // Convert the social links array and extra link to the format expected by the API
      const convertedSocialLinks = {
        twitter: "",
        linkedin: "",
        instagram: "",
        tiktok: "",
        youtube: "",
        extra: data?.extraLink?.url || "",
      };

      // Populate the social links
      data.socialLinks.forEach((link) => {
        if (link?.platform && link?.url) {
          convertedSocialLinks[
            link.platform as keyof typeof convertedSocialLinks
          ] = link.url;
        }
      });

      // Prepare the final data for submission
      const submissionData = {
        ...data,
        socialLinks: convertedSocialLinks,
      };

      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      if (response.ok) {
        toast({ title: "Success", description: "Registration successful" });
        router.push("/admin");
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during registration",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Add a default social link when the component loads
  useEffect(() => {
    if (step === 2 && fields.length === 0) {
      addSocialLink();
    }
  }, [step, fields.length]);

  if (isAuthenticated) {
    return (
      <div className="flex h-[calc(100vh-248px)] mt-20 items-center justify-center">
        <Card className="mt-16 w-96">
          <CardHeader>
            <CardTitle>Already Logged In</CardTitle>
            <CardDescription>
              Please logout to register a new account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={logout}>
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card className="w-[640px]">
      <CardHeader>
        <CardTitle>Registration (Step {step}/2)</CardTitle>
        <CardDescription>
          {step === 1 ? (
            <span>
              Basic Information (Mandatory) <br /> Please fill out these fields.
              Don't worry, you can update them later.
            </span>
          ) : (
            <span>
              {" "}
              Profile Details (Optional) - These fields are optional, but feel
              free to complete them. You can also update them later.
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {step === 1 && (
              <div className="grid grid-cols-1 w-full md:grid-cols-2 gap-4">
                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="John" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Doe" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="blogSubdomain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blog Handle</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="my-blog-handle"
                            className="peer ps-[88px] text-sm "
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
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="john@example.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            placeholder="********"
                            {...field}
                            type={isVisible ? "text" : "password"}
                            disabled={loading}
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setIsVisible(!isVisible)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                            tabIndex={-1}
                          >
                            {isVisible ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {step === 2 && (
              <div className="grid grid-cols-1 w-full md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="headline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Headline</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Professional Title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="City, Country" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="About you..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="col-span-2">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-sm font-medium">
                      Social Links (Select up to 3)
                    </h3>
                    {fields.length < 3 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addSocialLink}
                        className="h-8 px-2"
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add Social
                      </Button>
                    )}
                  </div>

                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex items-center gap-2 mb-3"
                    >
                      <FormField
                        control={form.control}
                        name={`socialLinks.${index}.platform`}
                        render={({ field: platformField }) => (
                          <FormItem className="flex-1">
                            <Select
                              onValueChange={(value) => {
                                platformField.onChange(value);
                                updateUrlPlaceholder(index, value);
                              }}
                              value={platformField.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select platform" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {SOCIAL_PLATFORMS.map((platform) => (
                                  <SelectItem
                                    key={platform.value}
                                    value={platform.value}
                                    disabled={fields.some(
                                      (f, i) =>
                                        i !== index &&
                                        form.getValues(
                                          `socialLinks.${i}.platform`
                                        ) === platform.value
                                    )}
                                  >
                                    {platform.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`socialLinks.${index}.url`}
                        render={({ field: urlField }) => (
                          <FormItem className="flex-[2]">
                            <FormControl>
                              <Input
                                {...urlField}
                                placeholder={
                                  form.getValues(
                                    `socialLinks.${index}.platform`
                                  )
                                    ? `https://${form.getValues(
                                        `socialLinks.${index}.platform`
                                      )}.com/username`
                                    : "Enter URL"
                                }
                                disabled={
                                  !form.getValues(
                                    `socialLinks.${index}.platform`
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        className="h-8 w-8"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  <div className="mt-4">
                    <FormField
                      control={form.control}
                      name="extraLink.url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Extra Link</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="https://example.com"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="col-span-2 flex justify-between gap-4">
              {step === 2 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                  disabled={loading}
                >
                  Back
                </Button>
              )}
              {step === 1 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="flex-1"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Next
                </Button>
              ) : (
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Register
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
