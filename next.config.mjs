/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async headers() {
      return [
        {
          source: "/api/:path*",
          headers: [
            { key: "Access-Control-Allow-Origin", value: "*" },
            { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
            { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
          ]
        },
        {
          source: "/:path*",
          headers: [
            { key: "Access-Control-Allow-Origin", value: "*" }
          ]
        }
      ]
    },
    async rewrites() {
      return [
        {
          source: "/",
          destination: "/api",
        },
      ];
    },
  };
  
  export default nextConfig;