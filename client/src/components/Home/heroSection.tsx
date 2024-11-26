import Image from "next/image";
import React from "react";

function HeroSection() {
  return (
    <div>
      <div className="mt-10">
        <h1 className="text-center text-black text-8xl font-normal font-nico leading-[134.40px] tracking-[3.84px]">
          CONNECTING RIDERS
        </h1>
        <div className="text-center text-black text-3xl font-normal font-nico leading-[50.40px] tracking-[5.76px]">
          TAKE RIDING TO NEXT LEVEL
        </div>
      </div>
      <div className="w-full flex justify-center mt-8 ">
        <Image
          width={1616}
          height={963}
          alt="HeroImage"
          className=""
          src="/riderImage.png"
        />
      </div>
    </div>
  );
}

export default HeroSection;
