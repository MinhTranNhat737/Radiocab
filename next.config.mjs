/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client']
  }
}

export default nextConfig