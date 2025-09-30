import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SurveyMadness",
  description: "Created by CodeSpartan",
  icons: {
    icon: '/favicon.ico',
  },
  };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
