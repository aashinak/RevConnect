import Image from 'next/image'
import React from 'react'

function SignInImage() {
  return (
    <div className="lg:w-2/5 lg:flex hidden lg:visible lg:justify-center lg:items-center">
          <Image
            className="rounded-lg "
            width={600}
            height={600}
            alt="loginImage"
            src={"/images/signIn.webp"}
          />
    </div>
  )
}

export default SignInImage