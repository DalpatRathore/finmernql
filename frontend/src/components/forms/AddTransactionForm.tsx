import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const transactionSchema = z.object({
  description: z
    .string()
    .min(3, { message: "Description must be at least 3 characters long." })
    .max(255, { message: "Description cannot exceed 255 characters." }),

  paymentType: z.enum(["cash", "card"], {
    message: "Payment type must be either 'cash' or 'card'.",
  }),

  category: z.enum(["saving", "expense", "investment"], {
    message: "Category must be one of 'saving', 'expense', or 'investment'.",
  }),

  amount: z
    .number()
    .min(0, { message: "Amount cannot be negative." })
    .refine(Number.isFinite, { message: "Amount must be a valid number." }),

  location: z
    .string()
    .max(100, { message: "Location cannot exceed 100 characters." })
    .optional()
    .or(z.literal("Unknown")),

  date: z.date().refine(date => date <= new Date(), {
    message: "Date cannot be in the future.",
  }),
});

export function AddTransactionForm() {
  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    // defaultValues: {
    //   username: "",
    //   password: "",
    // },
  });

  const onSubmit = (values: z.infer<typeof transactionSchema>) => {
    console.log(values);
  };

  return (
    <Card className="w-full mx-auto max-w-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Add Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 w-full px-5 mx-auto"
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paymentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PaymentType</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a value" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a value" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="saving">Saving</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                      <SelectItem value="investment">Investment</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="shadcn"
                      {...field}
                      onChange={e => {
                        const value = parseFloat(e.target.value); // Convert input to number
                        field.onChange(isNaN(value) ? 0 : value); // Set to 0 if NaN
                      }}
                    />
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
                    <Input placeholder="location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground" // Check if the field value is empty
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(new Date(field.value), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          } // Ensure this is a Date object
                          onSelect={date => {
                            if (date) {
                              field.onChange(date); // Directly set the Date object
                            }
                          }}
                          initialFocus
                          disabled={date => date > new Date()} // Disable future dates
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Add Transaction
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
