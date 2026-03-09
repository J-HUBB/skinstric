import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
});


export const metadata: Metadata = {
  title: "Skinstric",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
