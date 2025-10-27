/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'animaproject.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Tailwind CSS support
  transpilePackages: ['lucide-react'],
}

module.exports = nextConfig
