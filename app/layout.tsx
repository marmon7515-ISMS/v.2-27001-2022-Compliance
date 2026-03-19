import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Compliance OS",
  description: "Compliance platform"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
