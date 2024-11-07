/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["mongoose"],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.geojson$/,
      use: ["json-loader"],
      type: "javascript/auto",
    });
    return config;
  },
  onError: async (err, req, res) => {
    console.error(err);
    res.statusCode = 500;
    res.end("Internal Server Error");
  },
};

export default nextConfig;
