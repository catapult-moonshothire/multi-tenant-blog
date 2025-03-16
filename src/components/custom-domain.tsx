"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, CheckCircle, Clipboard } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const customDomainSchema = z.object({
  customDomain: z.string().min(1, "Custom domain is required"),
});

const newDomainSchema = z.object({
  newDomain: z.string().min(1, "New domain is required"),
});

interface CloudflareData {
  id: string;
  name: string;
  name_servers: string[];
  status: string;
  original_name_servers?: string[];
}

export default function CustomDomain({ subdomain }: { subdomain: string }) {
  const [showCustomDomain, setShowCustomDomain] = useState(false);
  const [showNewDomain, setShowNewDomain] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customDomainInfo, setCustomDomainInfo] = useState<{
    domainName: string;
    cloudflareData: CloudflareData | null;
  } | null>(null);
  const { toast } = useToast();

  const customDomainForm = useForm<z.infer<typeof customDomainSchema>>({
    resolver: zodResolver(customDomainSchema),
    defaultValues: {
      customDomain: "",
    },
  });

  const newDomainForm = useForm<z.infer<typeof newDomainSchema>>({
    resolver: zodResolver(newDomainSchema),
    defaultValues: {
      newDomain: "",
    },
  });

  const fetchDomainInfo = async () => {
    try {
      const response = await fetch(`/api/domain-info?subdomain=${subdomain}`);
      if (response.ok) {
        const data = await response.json();
        if (data.customDomain) {
          setCustomDomainInfo({
            domainName: data.customDomain,
            cloudflareData: data.cloudflareData
              ? JSON.parse(data.cloudflareData)
              : null,
          });
          setShowCustomDomain(false);
        }
      }
    } catch (error) {
      console.error("Error fetching domain info:", error);
    }
  };

  useEffect(() => {
    fetchDomainInfo();
  }, [subdomain]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The text has been copied to your clipboard.",
      variant: "default",
    });
  };

  const onCustomDomainSubmit = async (
    values: z.infer<typeof customDomainSchema>
  ) => {
    setLoading(true);

    try {
      const response = await fetch("/api/custom-domain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subdomain, customDomain: values.customDomain }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "Custom domain added successfully!",
          variant: "default",
        });
        fetchDomainInfo();
      } else {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting custom domain:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md p-0 shadow-none relative border-none">
      <CardHeader className="px-0">
        <CardTitle className="text-xl font-bold">Domain Settings</CardTitle>
        <CardDescription>
          Manage custom domain for your subdomain: <strong>{subdomain}</strong>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-0">
        {customDomainInfo ? (
          <div className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Custom Domain Added</AlertTitle>
              <AlertDescription>
                Your blog is connected to{" "}
                <strong>{customDomainInfo.domainName}</strong>
              </AlertDescription>
            </Alert>

            {customDomainInfo.cloudflareData && (
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="dns-settings">
                  <AccordionTrigger>DNS Configuration</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm mb-2">
                          Update your domain's nameservers at your domain
                          registrar:
                        </p>
                        <div className="bg-muted p-3 rounded-md relative">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 h-6 w-6"
                            onClick={() =>
                              copyToClipboard(
                                customDomainInfo.cloudflareData?.name_servers.join(
                                  "\n"
                                ) || ""
                              )
                            }
                          >
                            <Clipboard className="h-4 w-4" />
                          </Button>
                          <ul className="text-sm space-y-1 list-disc pl-5">
                            {customDomainInfo.cloudflareData.name_servers.map(
                              (ns, index) => (
                                <li key={index}>{ns}</li>
                              )
                            )}
                          </ul>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm mb-2">Current status:</p>
                        <div className="flex items-center space-x-2">
                          <div
                            className={`h-2 w-2 rounded-full ${
                              customDomainInfo.cloudflareData.status ===
                              "active"
                                ? "bg-green-500"
                                : "bg-amber-500"
                            }`}
                          ></div>
                          <span className="text-sm capitalize">
                            {customDomainInfo.cloudflareData.status}
                          </span>
                        </div>
                      </div>

                      {customDomainInfo.cloudflareData.status !== "active" && (
                        <Alert variant="destructive">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertTitle>Pending Setup</AlertTitle>
                          <AlertDescription>
                            Your domain is not yet active. Please update your
                            nameservers at your domain registrar to the
                            Cloudflare nameservers listed above. This process
                            may take 24-48 hours to complete.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}

            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setCustomDomainInfo(null);
                  setShowCustomDomain(true);
                }}
              >
                Change Domain
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="relative inline-grid h-5 grid-cols-[1fr_1fr] items-center text-sm font-medium">
                <Switch
                  id="custom-domain"
                  checked={showCustomDomain}
                  onCheckedChange={setShowCustomDomain}
                  className="peer absolute inset-0 h-[inherit] w-auto rounded-lg data-[state=unchecked]:bg-input/50 [&_span]:z-10 [&_span]:h-full [&_span]:w-1/2 [&_span]:rounded-md [&_span]:transition-transform [&_span]:duration-300 [&_span]:[transition-timing-function:cubic-bezier(0.16,1,0.3,1)] data-[state=checked]:[&_span]:translate-x-full rtl:data-[state=checked]:[&_span]:-translate-x-full"
                />
                <span className="min-w-78 flex pointer-events-none relative ms-0.5 items-center justify-center px-2 text-center transition-transform duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:invisible peer-data-[state=unchecked]:translate-x-full rtl:peer-data-[state=unchecked]:-translate-x-full" />
              </div>{" "}
              <Label className="cursor-pointer" htmlFor="custom-domain">
                Add custom domain if you have it already
              </Label>
            </div>

            {showCustomDomain && (
              <Form {...customDomainForm}>
                <form
                  onSubmit={customDomainForm.handleSubmit(onCustomDomainSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={customDomainForm.control}
                    name="customDomain"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Custom Domain</FormLabel>
                        <FormControl>
                          <Input placeholder="example.com" {...field} />
                        </FormControl>{" "}
                        <FormDescription>
                          Enter your custom domain without 'http://' or
                          'https://'
                        </FormDescription>{" "}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={loading}>
                    {loading ? "Submitting..." : "Add Custom Domain"}
                  </Button>
                </form>
              </Form>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
