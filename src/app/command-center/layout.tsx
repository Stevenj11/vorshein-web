import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "VORSHEIN // Command Center",
};

export default function CommandCenterRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full bg-black text-white">{children}</body>
    </html>
  );
}
