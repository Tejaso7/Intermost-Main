/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'intermost-backend.onrender.com',
      },
    ],
    // Use modern image formats for better performance
    formats: ['image/avif', 'image/webp'],
    // Optimize image loading
    minimumCacheTTL: 60,
  },
  // Performance optimizations
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  },
  // Experimental features for better performance
  experimental: {
    optimizeCss: true,
  },
  async redirects() {
    return [
      {
        source: '/dinipro_state_medical_university',
        destination: '/colleges',
        permanent: true,
      },
      {
        source: '/dinipro_state_medical_university/',
        destination: '/colleges',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
