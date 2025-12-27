import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";


export const metadata: Metadata = {
  title: "Project Dashboard - Manage Your Projects",
  description: "A feature-rich project management dashboard with real-time updates, advanced filtering, and role-based access.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Project Dashboard",
  },
  icons: {
    icon: [
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
