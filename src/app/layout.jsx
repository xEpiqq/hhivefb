import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Harmony Hive",
  description: "Practice Choir Music",
};

export default async function RootLayout({ children }) {

  return (
    <html lang="en" className="h-full">
      <head />
      <body className={inter.className + " h-full"}>
        {children}
      </body>   
    </html>
  );
}
