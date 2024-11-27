import { Button } from "@/components/ui/button";
import React from "react";

function SignInWithGoogle() {
  function handleGoogleSignIn() {
    console.log("Sign in with Google clicked");
    // Add Google sign-in integration logic here
  }
  return (
    <div className="w-full">
      {/* Divider */}
      <div className="my-4 w-full flex items-center">
        <div className="w-full border-t border-gray-300"></div>
        <span className="px-2 text-gray-500">or</span>
        <div className="w-full border-t border-gray-300"></div>
      </div>

      {/* Sign in with Google Button */}
      <Button
        onClick={handleGoogleSignIn}
        className="w-full p-6 flex items-center justify-center space-x-2 bg-white text-black border border-gray-300 hover:bg-gray-100"
      >
        <span>Sign in with Google</span>
      </Button>
    </div>
  );
}

export default SignInWithGoogle;
