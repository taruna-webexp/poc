"use client"
import "./globals.css";
import { SessionProvider } from "next-auth/react"
import Navbar from "@/components/common/Navbar";




export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body

      >
        <SessionProvider >


          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
