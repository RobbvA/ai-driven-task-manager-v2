/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Prevent markdown/license parse errors
    config.module.rules.push(
      { test: /\.md$/i, type: "asset/source" },
      { test: /LICENSE$/i, type: "asset/source" }
    );

    // Keep native/binary libsql packages out of bundling
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push(({ request }, callback) => {
        if (!request) return callback();

        const shouldExternalize =
          request.includes("@libsql/win32-x64-msvc") ||
          request.includes("@libsql/linux-x64-gnu") ||
          request.includes("@libsql/darwin") ||
          request.endsWith(".node");

        if (shouldExternalize) {
          return callback(null, `commonjs ${request}`);
        }

        return callback();
      });
    }

    return config;
  },
};

export default nextConfig;
