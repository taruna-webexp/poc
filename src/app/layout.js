"use client"
import "./globals.css";
import { SessionProvider } from "next-auth/react"
import Navbar from "@/components/common/Navbar";
import { usePathname } from "next/navigation";




export default function RootLayout({ children }) {
  const currentPath = usePathname()
  const isCurrentPath = currentPath.startsWith("/admin") || currentPath.startsWith("/auth")
  return (
    <html lang="en">
      <body

      >
        <SessionProvider >
          {
            isCurrentPath === false &&
            <>
              < Navbar />
            </>

          }

          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
