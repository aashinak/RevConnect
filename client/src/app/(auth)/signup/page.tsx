"use client";
import SignUpForm from "@/components/auth/SignUp/signUpForm";
import SignUpImage from "@/components/auth/SignUp/signUpImage";
import Wraper from "@/components/auth/wraper";

function SignUp() {
  return (
    <Wraper>
      <SignUpImage/>
      <SignUpForm/>
    </Wraper>
  );
}

export default SignUp;
