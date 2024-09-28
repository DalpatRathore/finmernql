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
import { Link, useNavigate } from "react-router-dom";
import { LOGIN } from "@/graphql/mutations/user.mutation";
import { useMutation } from "@apollo/client";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Username is required." })
    .min(4, { message: "Username must be at least 4 characters long." }),

  password: z
    .string()
    .min(1, { message: "Password is required." })
    .min(6, { message: "Password must be at least 6 characters long." }),
});

export function LoginForm() {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const [login, { loading, error }] = useMutation(LOGIN, {
    refetchQueries: ["GetAuthenticatedUser"],
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);

    try {
      await login({
        variables: {
          input: values,
        },
      });
      toast.success("Login successfull");
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Card className="w-full mx-auto max-w-xl">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      {error && (
        <div className="w-full flex items-center justify-center">
          <p className="text-red-600 text-center">
            Invalid username or password
          </p>
        </div>
      )}
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 w-full max-w-md mx-auto"
          >
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
                    <Input placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  Processing...
                  <Loader2 className="w-4 h-4 ml-2 animate-spin"></Loader2>
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link to={"/signup"} className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
