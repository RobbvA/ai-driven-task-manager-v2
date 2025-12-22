/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Treat markdown/license files as text (prevents parse errors)
    config.module.rules.push(
      { test: /\.md$/, type: "asset/source" },
      { test: /LICENSE$/i, type: "asset/source" }
    );

    // Prevent bundling native .node binaries from libSQL on the server bundle
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push(({ request }, callback) => {
        if (
          request &&
          (request.includes("@libsql/win32-x64-msvc") ||
            request.includes("@libsql/linux-x64-gnu") ||
            request.includes("@libsql/darwin") ||
            request.includes("libsql") ||
            request.endsWith(".node"))
        ) {
          return callback(null, `commonjs ${request}`);
        }
        callback();
      });
    }

    return config;
  },
};

export default nextConfig;
