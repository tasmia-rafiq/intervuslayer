import React from "react";

export default function MetricCard({ title, value, delta }: { title: string; value: React.ReactNode; delta?: React.ReactNode }) {
  return (
    <div className="card-interview" style={{ minWidth: 220 }}>
      <div className="muted text-sm">{title}</div>
      <div className="flex items-baseline gap-3">
        <div className="text-2xl font-semibold">{value}</div>
        {delta && <div className="badge-pill">{delta}</div>}
      </div>
    </div>
  );
}
