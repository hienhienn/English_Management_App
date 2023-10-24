/** @type {import('next').NextConfig} */

module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve = {
        ...config.resolve,
        fallback: {
          ...config.resolve.fallback,
          fs: false,
        },
      };
    }
    config.module = {
      ...config.module,
      exprContextCritical: false,
    };
    return config;
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: false,
        basePath: false,
      },
    ];
  },
};
