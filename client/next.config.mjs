import webpack from "webpack"
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env.mjs"));

const securityHeaders = [
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "Content-Security-Policy",
    value:
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://api.coingecko.com http://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js https://www.google-analytics.com https://www.googletagmanager.com/ https://*.google.com https://cdn.usefathom.com https://*.hcaptcha.com https://*.freshworks.com https://www.gstatic.com;",
  },
];

/** @type {import("next").NextConfig} */
const config = {
   reactStrictMode: false,
  webpack(config, { buildId }) {
    config.module.rules.push({ test: /\.svg$/, use: ["@svgr/webpack"] });
    config.plugins.push(
      new webpack.DefinePlugin({ "process.env.BUILD_ID": JSON.stringify(buildId) })
    );
    config.resolve.fallback = { fs: false, module: false, path: false }
    return config;
  },

    async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },

  //   async redirects() {
  //   return [
  //     {
  //       source: "/",
  //       destination: "/home",
  //       permanent: false,
  //     },
  //   ];
  // },

  /**
   * If you have the "experimental: { appDir: true }" setting enabled, then you
   * must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
};

export default config;
