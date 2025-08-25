/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      // --- ADD THIS NEW BLOCK ---
      {
        protocol: 'https',
        hostname: 'wedvnqodumsnpxjposa.supabase.co', // Your specific Supabase hostname
      },
      // --- END OF NEW BLOCK ---
    ],
  },
}

export default nextConfig