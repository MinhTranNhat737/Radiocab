import type React from "react"
import type { Metadata } from "next"
import { Inter, Roboto, Open_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import Footer from "@/components/Footer"
import SmoothTransition from "@/components/SmoothTransition"
import "./globals.css"

// Font configurations
const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
})

const roboto = Roboto({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-roboto",
  display: "swap",
})

const openSans = Open_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-open-sans",
  display: "swap",
})

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
      <body className={`font-sans ${inter.variable} ${roboto.variable} ${openSans.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SmoothTransition>
            <Suspense fallback={
              <div className="min-h-screen flex items-center justify-center">
                <div className="loading-spinner w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full"></div>
              </div>
            }>
              {children}
            </Suspense>
          </SmoothTransition>
          <Footer />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
