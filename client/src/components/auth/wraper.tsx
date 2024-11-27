import React from "react";

function Wraper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="flex justify-between h-screen">{children}</div>;
}

export default Wraper;
