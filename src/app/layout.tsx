import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sami Hanine",
  description: "Sami Hanine is a software developer and entrepreneur.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <meta name="viewport" content="width=device-width" />

      <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="author" content="Michael Andreuzza" />
      <meta
        name="keywords"
        content="web development, software development, programming, coding, sami hanine, entrepreneur, business, technology, react, next.js, tailwindcss, typescript"
      />
      <meta name="msapplication-TileColor" content="#1b1d20" />
      <meta name="theme-color" content="#1b1d20" />

      <body className={inter.className}>{children}</body>
    </html>
  );
}
