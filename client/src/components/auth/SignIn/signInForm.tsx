"use client";

import Link from "next/link"; // Import Link from Next.js for navigation
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
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
import SignInWithGoogle from "./signInWithGoogle";
import { login } from "@/api/auth/auth";
import { useRouter } from "next/navigation";

// Define the form schema using Zod
const formSchema = z
  .object({
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters long.",
    }),
    confirmPassword: z
      .string()
      .min(8, {
        message: "Confirm password must be at least 8 characters long.",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match.",
    path: ["confirmPassword"], // Attach error to confirmPassword field
  });

function SignInForm() {
  // 1. Define your form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const router = useRouter()
  // 2. Define a submit handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form values:", values);
    const res = await login(values)
    console.log("Response data", res);
    router.push("/chat")
  }

  return (
    <div className="lg:w-3/5 w-full flex items-center justify-center flex-col bg-[#f9f9f9]">
      <div className="lg:w-1/2 w-full items-center flex flex-col border p-10 rounded-lg shadow-lg">
      <h1 className="text-2xl font-nico tracking-[2px] mb-5">SIGN IN</h1>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full"
          >
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-md">Email</FormLabel>
                  <FormControl>
                    <Input
                      className="p-7"
                      placeholder="yourname@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter your email address to sign in.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-md">Password</FormLabel>
                  <FormControl>
                    <Input
                      className="p-7"
                      type="password"
                      placeholder="********"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter a strong password (at least 8 characters).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password Field */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-md">Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      className="p-7"
                      type="password"
                      placeholder="********"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Re-enter your password to confirm.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button type="submit" className="w-full p-7">
              Submit
            </Button>
          </form>
        </Form>
        <SignInWithGoogle />

        {/* Navigation to Signup */}
        <div className="mt-4 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link href="/signup">
            <h1 className="text-black font-medium hover:underline">Sign up here</h1>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignInForm;
