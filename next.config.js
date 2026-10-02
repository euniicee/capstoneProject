/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'api.oluwasetemi.dev',
      },

      { protocol: "https", 
        hostname: "cdn.vanguardngr.com" },

      { protocol: "https",
        hostname: "placehold.net"
      }  
    ],
  },
};

module.exports = nextConfig;
