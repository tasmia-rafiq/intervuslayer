import React from "react";

export default function EmptyState({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="card-interview flex flex-col items-center justify-center text-center p-10">
      <div className="text-2xl font-semibold mb-2">{title}</div>
      {subtitle && <div className="muted mb-4">{subtitle}</div>}
      {action}
    </div>
  );
}
