"use client";
import * as React from "react";
import AuthenticatedHeader from "../home-components/AuthenticatedHeader";

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
