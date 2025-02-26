"use client";

import { reserveSpot } from "@/app/actions/reserve-spot";
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
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const reserveSpotSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

export const ReserveSpotForm2 = () => {
  const form = useForm<z.infer<typeof reserveSpotSchema>>({
    resolver: zodResolver(reserveSpotSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof reserveSpotSchema>) => {
    const result = await reserveSpot(values.email);

    if (result.success) {
      form.reset();
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative flex flex-col gap-4 w-full"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormLabel className="sr-only">Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="jane@acme.com"
                  {...field}
                  className="w-full "
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          Reserve Your Spot
        </Button>
      </form>
    </Form>
  );
};
