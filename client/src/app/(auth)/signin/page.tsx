"use client";
import SignInForm from "@/components/auth/SignIn/signInForm";
import SignInImage from "@/components/auth/SignIn/signInImage";
import Wraper from "@/components/auth/wraper";

function SignIn() {
  return (
    <Wraper>
      <SignInForm/>
      <SignInImage/>
    </Wraper>
  );
}

export default SignIn;
