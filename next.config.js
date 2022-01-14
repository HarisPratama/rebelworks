module.exports = {
  reactStrictMode: false,
  env: {
    api_key: 'c99a687890015fbe80f81d279426568d',
    imagePath: 'https://image.tmdb.org/t/p/original'
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
}
