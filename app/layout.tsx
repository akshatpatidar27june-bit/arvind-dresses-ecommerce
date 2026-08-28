import type { Metadata } from "next";
import "./globals.css";
import "./premium.css";
import "./mobile-navigation.css";

export const metadata: Metadata = {
  title: "Arvind Dresses | Mandsaur",
  description: "Shop the latest fashion from Arvind Dresses, Mandsaur.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
