
"use client";
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { Inter, IBM_Plex_Serif } from "next/font/google";
import "./globals.css";
import { connectDB } from "@/lib/connectDB";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-ibm-plex-serif",
});

// export const metadata: Metadata = {
//   title: "FinPay",
//   description: "FinPay is a modern banking platform for everyone.",
//   icons: {
//     icon: "/icons/logo.svg",
//   },
// };

declare const window: any;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initBotpress = () => {
    window.botpressWebChat.init({
      composerPlaceholder: "Chat with bot",
      botConversationDescription:
        "This chatbot was built surprisingly fast with Botpress",
      botId: "0f184fd4-fb3d-456b-91e0-2eb2c686f07e",
      hostUrl: "https://cdn.botpress.cloud/webchat/v1",
      messagingUrl: "https://messaging.botpress.cloud",
      clientId: "0f184fd4-fb3d-456b-91e0-2eb2c686f07e",
      webhookId: "c742b92c-26d7-4594-a023-0f06d99c7bac",
      lazySocket: true,
      themeName: "prism",
      frontendVersion: "v1",
      showPoweredBy: true,
      theme: "prism",
      themeColor: "#2563eb",
      allowedOrigins: [],
    });
  };

  return (
    <html lang="en">
      <head>
        <Script
          src="https://cdn.botpress.cloud/webchat/v0/inject.js"
          onLoad={() => {
            initBotpress();
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
