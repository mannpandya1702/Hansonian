/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // required for Docker minimal image build

  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
