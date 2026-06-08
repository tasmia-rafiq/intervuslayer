import React from "react";

export default function StatusBadge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`badge-pill ${className}`}>{children}</span>
  );
}
