/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ["pixner.net", "res.cloudinary.com", "i.pinimg.com", "unsplash.com", "images.unsplash.com"],
  },
  swcMinify: true,
};

module.exports = nextConfig;
