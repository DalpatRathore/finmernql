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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

const formSchema = z
  .object({
    username: z
      .string()
      .min(4, { message: "Username must be at least 4 characters long." })
      .max(20, { message: "Username cannot exceed 20 characters." })
      .regex(/^[a-zA-Z0-9]+$/, {
        message: "Username can only contain alphanumeric characters.",
      }),

    name: z
      .string()
      .min(2, { message: "Name must be at least 2 characters long." })
      .max(50, { message: "Name cannot exceed 50 characters." }),

    gender: z.enum(["male", "female"], {
      errorMap: () => ({
        message: "Gender must be either 'male' or 'female'.",
      }),
    }),

    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long." })
      .max(100, { message: "Password cannot exceed 100 characters." })
      .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/, {
        message: "Password must contain at least one letter and one number.",
      }),

    confirmPassword: z
      .string()
      .min(6, {
        message: "Confirm Password must be at least 6 characters long.",
      })
      .max(100, { message: "Confirm Password cannot exceed 100 characters." }),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match.",
        path: ["confirmPassword"], // Specify the path for the error
      });
    }

    // profilePic: z
    //   .string()
    //   .url({ message: "Profile picture must be a valid URL." })
    //   .regex(/^https?:\/\/.+\.(jpg|jpeg|png)$/, {
    //     message: "Profile picture must be a valid image URL (jpg, jpeg, png).",
    //   })
    //   .optional(), // Optional since it has a default value
  });

export function SignupForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };
  return (
    <Card className="w-full mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl">Register</CardTitle>
        <CardDescription>
          Enter your email below to register to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full max-w- mx-auto"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
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
                    <Input type="password" placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="confirm Password"
                      {...field}
                      onPaste={e => e.preventDefault()}
                      onCopy={e => e.preventDefault()}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-5 pl-10"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="male" />
                        </FormControl>
                        <FormLabel className="font-normal">Male</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="female" />
                        </FormControl>
                        <FormLabel className="font-normal">Female</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Register
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link to={"/login"} className="underline">
            Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
