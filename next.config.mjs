/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  // 显式声明服务端环境变量
  serverRuntimeConfig: {
    DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY,
    GLM_API_KEY: process.env.GLM_API_KEY,
  },
  // 确保环境变量在所有服务端路由中可用
  env: {
    DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY,
    GLM_API_KEY: process.env.GLM_API_KEY,
  },
}

export default nextConfig

