/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: { bodySizeLimit: '2gb' },
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Remotion ve native binary'leri server bundle'ından dışarıda tut
      config.externals = [
        ...(config.externals || []),
        '@remotion/bundler',
        '@remotion/renderer',
        '@remotion/compositor-darwin-arm64',
        '@remotion/compositor-linux-x64',
        '@remotion/compositor-linux-arm64',
        'remotion',
      ]
    }
    return config
  },
}
module.exports = nextConfig
