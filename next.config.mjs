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
  // Vercel 原生支持环境变量，无需额外配置
  // 服务端环境变量通过 process.env 自动可用
  // 客户端环境变量需要 NEXT_PUBLIC_ 前缀
}

export default nextConfig

