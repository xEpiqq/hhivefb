/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    return config;
  },
  // add domain for images
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
};

export default nextConfig;
