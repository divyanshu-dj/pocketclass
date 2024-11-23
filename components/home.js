"use client";
import * as React from "react";
import Head from 'next/head';
import AuthenticatedHeader from "../home-components/AuthenticatedHeader";

export default function Home() {
  return (
    <>
      <Head>
        <link rel="icon" href="/pc_favicon.ico" />
      </Head>
      <div
        style={{ display: "inline-block", width: "100%" }}
        data-ignore="used only for top most containter width"
      >
        <AuthenticatedHeader />
      </div>
    </>
  );
}
