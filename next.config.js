/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    unoptimized: true,
  },
  transpilePackages: [
    '@leapwallet/cosmos-social-login-capsule-provider-ui',
    '@leapwallet/cosmos-social-login-capsule-provider',
    '@leapwallet/embedded-wallet-sdk-react',
    '@leapwallet/embedded-wallet-sdk-core'
  ],
}

module.exports = nextConfig
