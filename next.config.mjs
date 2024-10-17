/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      use: {
        loader: "url-loader",
      },
    });
    return config;
  },
  images: {
    domains: ["pauzdqhrtejetcbmesqv.supabase.co"],
  },
};

export default nextConfig;
