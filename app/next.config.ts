import type { NextConfig } from "next";

// Pin the project root to this folder. Left to guess, Next picks the
// highest lockfile it finds, and a stray one in the home directory made it
// watch all of ~ (dev then served stale CSS).
const projectRoot = __dirname;

const nextConfig: NextConfig = {
  turbopack: { root: projectRoot },
  outputFileTracingRoot: projectRoot,
  async rewrites() {
    return {
      // Host routing — replaces what src/proxy.ts used to do.
      // Only the root is rewritten: admin.projectblue.cc/ lands on the
      // dashboard. Deeper /admin/* links already carry the prefix, so they
      // resolve directly without a double-prefix.
      beforeFiles: [
        {
          source: "/",
          has: [{ type: "host", value: "admin.projectblue.cc" }],
          destination: "/admin",
        },
      ],
    };
  },
  async redirects() {
    return [
      // projectblue.cc is the one front door. Temporary (307) so browsers
      // don't cache it forever if beta.* ever needs to come back.
      // The root needs its own rule: on Cloudflare (OpenNext) an empty
      // :path* is left in the destination as literal ":path*".
      {
        source: "/",
        has: [{ type: "host", value: "beta.projectblue.cc" }],
        destination: "https://projectblue.cc/",
        permanent: false,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "beta.projectblue.cc" }],
        destination: "https://projectblue.cc/:path*",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
