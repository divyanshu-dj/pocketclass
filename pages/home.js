"use client";
import * as React from "react";
import AuthenticatedHeader from "../components2/AuthenticatedHeader";

export default function Home() {
  return (
    <div
      style={{ display: "inline-block", width: "100%" }}
      data-ignore="used only for top most containter width"
    >
      <AuthenticatedHeader />
    </div>
  );
}
