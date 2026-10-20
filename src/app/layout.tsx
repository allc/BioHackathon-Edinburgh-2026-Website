import "~/styles/globals.css";

import { Analytics } from "@vercel/analytics/react";
import { GeistSans } from "geist/font/sans";
import { IBM_Plex_Mono } from "next/font/google";
import { type Metadata } from "next";

import { Toaster } from "~/components/ui/sonner";
import { type ReactNode } from "react";

export const metadata: Metadata = {
  title: "BioHackathon Edinburgh 2026",
  description: "BioHackathon Edinburgh 2026 - Building a Collaborative Bio-AI Innovation Community",
  icons: [{ rel: "icon", url: "/primed_arrow.png" }],
};

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${ibmPlexMono.className} ${GeistSans.variable} dark`}
    >
      <body className="bg-white text-zinc-900">
        <Toaster
          position="bottom-center"
          toastOptions={{
            className: "bg-zinc-900 border-none",
            classNames: {
              success: "bg-green-600",
              error: "bg-red-600",
            },
          }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
