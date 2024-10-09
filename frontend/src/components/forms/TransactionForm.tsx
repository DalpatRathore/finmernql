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
import { CalendarIcon, Loader2Icon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { useMutation, useQuery } from "@apollo/client";
import {
  CREATE_TRANSACTION,
  UPDATE_TRANSACTION,
} from "@/graphql/mutations/transaction.mutation";
import toast from "react-hot-toast";
import { GET_TRANSACTION } from "@/graphql/queries/transaction.query";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardButton from "../DashboardButton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const transactionSchema = z.object({
  description: z
    .string()
    .min(3, { message: "Description must be at least 3 characters long." })
    .max(255, { message: "Description cannot exceed 255 characters." }),

  paymentType: z.enum(["cash", "card"], {
    message: "Please select value",
  }),

  category: z.enum(["saving", "expense", "investment"], {
    message: "Please select value",
  }),

  amount: z
    .number()
    .min(1, { message: "Amount should be positive." })
    .max(1000000, { message: "Max amount upto 1,000,000." }) // Set a maximum limit
    .refine(Number.isFinite, { message: "Amount must be a valid number." }),

  location: z
    .string()
    .max(50, { message: "Location cannot exceed 50 characters." })
    .optional()
    .or(z.literal("Unknown")),

  date: z.date().refine(date => date <= new Date(), {
    message: "Date cannot be in the future.",
  }),
});

type TransactionFormProps = {
  formType: string;
  transactionId?: string;
};

const TransactionForm = ({ formType, transactionId }: TransactionFormProps) => {
  const navigate = useNavigate();
  const { data, loading: fetchLoading } = useQuery(GET_TRANSACTION, {
    variables: { id: transactionId },
    skip: formType === "create",
  });

  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      paymentType: data?.transaction?.paymentType || "cash",
      category: data?.transaction?.category || "saving",
      amount: data?.transaction?.amount || 0,
      description: data?.transaction?.description || "",
      location: data?.transaction?.location || "",
      date:
        data?.transaction?.date && !isNaN(data.transaction.date)
          ? new Date(Number(data?.transaction?.date)) // Correctly convert from seconds to milliseconds
          : new Date(), // Fallback to current date
    },
  });

  const [createTransaction, { loading: createLoading }] = useMutation(
    CREATE_TRANSACTION,
    {
      refetchQueries: ["GetTransactions", "GetTransactionStatistics"],
    }
  );

  const [updateTransaction, { loading: updateLoading }] = useMutation(
    UPDATE_TRANSACTION,
    {
      refetchQueries: ["GetTransactions", "GetTransactionStatistics"],
    }
  );

  const onSubmit = async (values: z.infer<typeof transactionSchema>) => {
    try {
      if (formType === "Create") {
        await createTransaction({
          variables: {
            input: values,
          },
        });
        toast.success("Transaction created successfully!");
      } else if (formType === "Update" && transactionId) {
        await updateTransaction({
          variables: {
            input: { ...values, transactionId },
          },
        });

        toast.success("Transaction updated successfully!");
      }
      form.reset();
      navigate("/");
    } catch (error) {
      toast.error("Something went wrong. \nPlease try again.");
      console.log(error);
    }
  };

  useEffect(() => {
    if (data?.transaction) {
      form.reset({
        description: data.transaction.description || "",
        paymentType: data.transaction.paymentType || "cash",
        category: data.transaction.category || "saving",
        amount: data.transaction.amount || 0,
        location: data.transaction.location || "",
        date:
          data?.transaction?.date && !isNaN(data.transaction.date)
            ? new Date(Number(data?.transaction?.date))
            : new Date(),
      });
    }
  }, [data, form]);

  if (fetchLoading && formType === "Update") {
    return (
      <div className="flex items-center justify-center h-full w-full px-5">
        <Card className="w-full max-w-lg h-full grid grid-rows-[auto_1fr_auto] px-5">
          <CardHeader className="flex items-start mb-5">
            <Skeleton className="h-10 w-40 rounded-lg" />
          </CardHeader>
          <CardContent className="space-y-8">
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <div className="w-full flex items-center justify-center gap-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="w-full flex items-center justify-center gap-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-full rounded-lg" />
          </CardContent>
          <CardFooter>
            <Button disabled className="w-full bg-muted">
              Update Transaction
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (formType === "Update" && !data?.transaction) {
    return (
      <div className="w-full max-w-lg mx-auto">
        <Card className="text-center h-96 flex flex-col items-center justify-center">
          <CardContent>
            <p className="text-lg font-semibold">No record found!</p>
          </CardContent>
          <CardFooter>
            <DashboardButton></DashboardButton>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">{formType} Transaction</CardTitle>
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
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 lg:gap-8">
              <FormField
                control={form.control}
                name="paymentType"
                render={({ field }) => (
                  <FormItem className="w-full">
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
                  <FormItem className="w-full">
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
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 lg:gap-8">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="100.50"
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
                name="date"
                render={({ field }) => (
                  <FormItem className="w-full">
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
            </div>

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
            <Separator></Separator>
            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={createLoading || updateLoading}
            >
              {createLoading || updateLoading ? (
                <>
                  Submitting...
                  <Loader2Icon className="w-4 h-4 animate-spin ml-2"></Loader2Icon>
                </>
              ) : formType === "Create" ? (
                "Create Transaction"
              ) : (
                "Update Transaction"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TransactionForm;
