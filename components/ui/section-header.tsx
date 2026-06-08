import React from "react";

export default function SectionHeader({ title, subtitle, className = "" }: { title: React.ReactNode; subtitle?: React.ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <h2 className="text-2xl font-semibold">{title}</h2>
      {subtitle && <p className="muted text-sm">{subtitle}</p>}
    </div>
  );
}
