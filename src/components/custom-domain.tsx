"use client";

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
import { Label } from "@/components/ui/label"; // Import Label
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const customDomainSchema = z.object({
  customDomain: z.string().min(1, "Custom domain is required"),
});

const newDomainSchema = z.object({
  newDomain: z.string().min(1, "New domain is required"),
});

export default function CustomDomain({ subdomain }: { subdomain: string }) {
  const [showCustomDomain, setShowCustomDomain] = useState(false);
  const [showNewDomain, setShowNewDomain] = useState(false);
  const [loading, setLoading] = useState(false);
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

  const onCustomDomainSubmit = async (
    values: z.infer<typeof customDomainSchema>
  ) => {
    setLoading(true);
    const response = await fetch("/api/custom-domain", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ subdomain, customDomain: values.customDomain }),
    });

    const data = await response.json();
    setLoading(false);
    if (response.ok) {
      toast({
        title: "Success",
        description: "Custom domain added successfully!",
        variant: "default",
      });
    } else {
      toast({
        title: "Error",
        description: data.error,
        variant: "destructive",
      });
    }
  };

  const onNewDomainSubmit = async (values: z.infer<typeof newDomainSchema>) => {
    setLoading(true);
    const response = await fetch("/api/request-domain", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ subdomain, newDomain: values.newDomain }),
    });

    const data = await response.json();
    setLoading(false);
    if (response.ok) {
      toast({
        title: "Success",
        description: "Domain request sent successfully!",
        variant: "default",
      });
    } else {
      toast({
        title: "Error",
        description: data.error,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className=" max-w-md p-0 shadow-none relative border-none">
      <CardHeader className="px-0">
        <CardTitle className="text-xl font-bold">Domain Settings</CardTitle>
        <CardDescription>
          Manage custom domain for your subdomain: <strong>{subdomain}</strong>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-0">
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
            </div>
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
                      </FormControl>
                      <FormDescription>
                        Enter your custom domain without 'http://' or 'https://'
                      </FormDescription>
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
        <div className="relative p-2">
          <div className="absolute inset-2 max-w-sm flex justify-center items-center h-px bg-primary/20">
            {" "}
            <span className="bg-background px-3">Or</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="relative inline-grid h-5 grid-cols-[1fr_1fr] items-center text-sm font-medium">
              <Switch
                id="new-domain"
                checked={showNewDomain}
                onCheckedChange={setShowNewDomain}
                className="peer absolute inset-0 h-[inherit] w-auto rounded-lg data-[state=unchecked]:bg-input/50 [&_span]:z-10 [&_span]:h-full [&_span]:w-1/2 [&_span]:rounded-md [&_span]:transition-transform [&_span]:duration-300 [&_span]:[transition-timing-function:cubic-bezier(0.16,1,0.3,1)] data-[state=checked]:[&_span]:translate-x-full rtl:data-[state=checked]:[&_span]:-translate-x-full"
              />
              <span className="min-w-78 flex pointer-events-none relative ms-0.5 items-center justify-center px-2 text-center transition-transform duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] peer-data-[state=checked]:invisible peer-data-[state=unchecked]:translate-x-full rtl:peer-data-[state=unchecked]:-translate-x-full"></span>
            </div>
            <Label className="cursor-pointer" htmlFor="new-domain">
              Request new domain
            </Label>
          </div>
          {showNewDomain && (
            <Form {...newDomainForm}>
              <form
                onSubmit={newDomainForm.handleSubmit(onNewDomainSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={newDomainForm.control}
                  name="newDomain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Domain</FormLabel>
                      <FormControl>
                        <Input placeholder="mynewdomain.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter the domain you'd like to request
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={loading}>
                  {loading ? "Submitting..." : "Request New Domain"}
                </Button>
              </form>
            </Form>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
