import React from "react";

function Wraper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex flex-col justify-center items-center">
      {children}
    </main>
  );
}

export default Wraper;
