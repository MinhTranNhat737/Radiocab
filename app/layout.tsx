import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import Footer from "@/components/Footer"
import "./globals.css"

export const metadata: Metadata = {
  title: "RadioCabs.in - Cổng Thông Tin Taxi Hàng Đầu Việt Nam",
  description:
    "Kết nối công ty taxi, tài xế và khách hàng. Đăng ký dịch vụ, tìm kiếm thông tin taxi và gửi phản hồi dễ dàng.",
  generator: "RadioCabs.in",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={null}>{children}</Suspense>
          <Footer />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
