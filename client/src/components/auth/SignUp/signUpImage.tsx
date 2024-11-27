import Image from "next/image";
import React from "react";

function SignUpImage() {
  return (
    <div className="w-2/5 flex justify-center items-center">
      <Image
        className="rounded-lg"
        width={600}
        height={600}
        alt="loginImage"
        src={"/images/signUp.webp"}
      />
    </div>
  );
}

export default SignUpImage;
