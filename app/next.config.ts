import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
