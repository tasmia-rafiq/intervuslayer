"use client";
import React from "react";
import Container from "./Container";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      <Container>
        <div className="root-layout">{children}</div>
      </Container>
    </div>
  );
}
