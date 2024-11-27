"use client";

import Link from "next/link";
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
import { signup } from "@/api/auth/auth";
// import { useRouter } from "next/navigation";
import { useState } from "react";
import SignInWithGoogle from "../SignIn/signInWithGoogle";
import { OtpSubmit } from "../Otp/OtpConfirm";
import { useToast } from "@/hooks/use-toast";

// Define the schema for validation
const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." }),
  avatar: z
    .any()
    .refine((file) => file instanceof File, { message: "Invalid file type." })
    .optional(),
});

function SignUpForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      avatar: undefined,
    },
  });

  // const router = useRouter();
  const [fileError, setFileError] = useState<string | null>(null);
  const [isOtpDialogOpen, setIsOtpDialogOpen] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("")
  const { toast } = useToast();

  // Submit handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const formData = {
        name: values.name,
        email: values.email,
        password: values.password,
        avatar: values.avatar,
      };
      setEmail(values.email)
      const res = await signup(formData); // Call the signup API
      console.log("Signup response:", res);
      if(res.success === false)
        throw new Error(res.message)

      // Redirect after successful signup
      // router.push("/chat");
      setIsOtpDialogOpen(true);
    } catch (error: any) {
      console.error("Signup failed:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive", // Optional: A red-styled toast for errors
        duration: 5000, // Optional: Auto-dismiss after 5 seconds
      });
    }
  };

  return (
    <div className=" lg:w-3/5 w-full flex items-center justify-center flex-col bg-[#f9f9f9]">
      <div className="lg:w-1/2 w-full flex items-center flex-col border  p-10 rounded-lg shadow-lg">
        <h1 className="text-2xl font-nico tracking-[2px] mb-5">SIGN UP</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full"
          >
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-md">Name</FormLabel>
                  <FormControl>
                    <Input className="p-7" placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Avatar Field */}
            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-md">Avatar</FormLabel>
                  <FormControl>
                    <Input
                      className="p-5"
                      type="file"
                      accept=".jpg, .jpeg, .png"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (
                          file &&
                          (file.type === "image/jpeg" ||
                            file.type === "image/png")
                        ) {
                          setFileError(null); // Clear error if file is valid
                          field.onChange(file);
                        } else {
                          setFileError(
                            "Please select a valid image file (JPG or PNG)."
                          );
                          e.target.value = ""; // Reset the input field
                        }
                      }}
                    />
                  </FormControl>
                  {fileError && <FormMessage>{fileError}</FormMessage>}
                  <FormDescription>
                    Upload your profile picture (JPG or PNG only).
                  </FormDescription>
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button type="submit" className="w-full p-7">
              Sign Up
            </Button>
          </form>
        </Form>
        <SignInWithGoogle />
        {/* Navigation to SignIn */}
        <div className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/signin">
            <h1 className="text-black font-medium hover:underline">
              Sign in here
            </h1>
          </Link>
        </div>
      </div>
       {/* Trigger OTP Dialog upon form submission */}
       <OtpSubmit email={email} isOpen={isOtpDialogOpen} setIsOpen={setIsOtpDialogOpen} />
    </div>
  );
}

export default SignUpForm;
