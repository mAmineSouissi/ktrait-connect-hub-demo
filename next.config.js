/** @type {import('next').NextConfig} */
const { version } = require("./package.json");
const nextConfig = {
  reactStrictMode: true,
  // Improve webpack stability when mixing App Router and Pages Router
  webpack: (config, { isServer }) => {
    // Prevent webpack chunk loading issues
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
      };
    }
    return config;
  },
  // Experimental features to improve stability
  experimental: {
    // Improve hot reloading stability
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  env: {
    NEXT_PUBLIC_APP_VERSION: version,
    // Explicitly expose environment variables for server-side usage
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },
};

module.exports = nextConfig;
