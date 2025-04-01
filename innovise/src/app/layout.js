import { Inter } from "next/font/google";
import "./globals.css";
import ClientWrapper from "@/components/ClientWrapper";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Innovise",
  description: "Empowering Startups, Validating Success",
  favicon: "/icon.ico",
  icons: {
    icon: "/icon.ico",  
    apple: "/icon.ico",  
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon.ico" />
</head>
      <body className={`min-h-screen ${inter.variable}`}>
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
