import type { Metadata } from "next";
import "./globals.css";
import { SiteRuntimeScript } from "../components/site-runtime-script";

export const metadata: Metadata = {
  title: "JCCHUA & Associates",
  description: "Sustainable residential and commercial architecture by Arch. Joseph C. Chua.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <SiteRuntimeScript />
      </body>
    </html>
  );
}
