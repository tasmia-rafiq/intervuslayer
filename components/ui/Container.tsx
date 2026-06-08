import React from "react";

export default function Container({ children, className = "" }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`mx-auto w-full max-w-[1180px] px-6 ${className}`}>{children}</div>
  );
}
