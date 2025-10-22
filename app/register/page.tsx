"use client"

import Header from "@/components/Header"
import Link from "next/link"

export default function RegisterPage() {
  return (
    <div>
      <Header />
      <main className="container py-12">
        <h1 className="text-2xl font-bold">Đăng ký</h1>
        <p className="mt-4">Trang đăng ký - placeholder. Chọn loại tài khoản để tiếp tục.</p>
        <div className="mt-6 space-x-4">
          <Link href="/register/company" className="underline">Đăng ký công ty</Link>
          <Link href="/register/driver" className="underline">Đăng ký tài xế</Link>
        </div>
        <div className="mt-6">
          <Link href="/verify" className="text-sm text-primary">Đã đăng ký? Xác thực tài khoản</Link>
        </div>
      </main>
    </div>
  )
}
