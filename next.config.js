/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD
  },
  images: {
    domains: ['github.githubassets.com'],
  },
}

module.exports = nextConfig

