import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "res.cloudinary.com",
      "images.unsplash.com",
      "cdn.discordapp.com",
      "lh3.googleusercontent.com",
      "i.imgur.com",
      "avatars.githubusercontent.com",
      "cdn.pixabay.com",
      "images.pexels.com",
      "www.gravatar.com",
      "cdn.pixabay.com",
      "www.gravatar.com",
      "localhost",
    ],
  },
  eslint: {
    // Não bloquear o build na Vercel por erros de lint
    // (mas ainda recomendamos corrigir todos os erros)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Não bloquear o build na Vercel por erros de TypeScript
    // (mas ainda recomendamos corrigir todos os erros)
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
