import Link from "next/link";
import React from "react";

function Navbar() {
  return (
      <nav className="flex w-full justify-between px-16 py-10">
        <Link href={"/"}>
          <div
            className="px-3 py-1 rounded-lg border border-[#404040] 
         text-center text-black text-[30px]  font-nico leading-[50.80px] tracking-[2px] shadow-sm"
          >
            REVCONNECT
          </div>
        </Link>

        <ul className="flex gap-14   ">
          <li>
            <Link href={"/signin"}>
              <div className="text-center hover:bg-[#404040] px-2 rounded-lg hover:text-white transition-all ease-in-out duration-200 cursor-pointer text-black text-[25px] font-normal font-nico leading-[44.80px]">
                SIGN IN
              </div>
            </Link>
          </li>
          <li>
            <Link href={"/signup"}>
              <div className="text-center hover:bg-[#404040] px-2 rounded-lg hover:text-white transition-all ease-in-out duration-200 cursor-pointer text-black text-[25px] font-normal font-nico leading-[44.80px]">
                SIGN UP
              </div>
            </Link>
          </li>
        </ul>
      </nav>
  );
}

export default Navbar;
