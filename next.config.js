module.exports = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            icon: true,
            replaceAttrValues: { "#fff": "currentColor" },
          },
        },
      ],
    })

    return config
  },
  images: {
    domains: ["storageapi.fleek.co"],
  },
  async redirects() {
    return [
      {
        source: "/guild/:path*",
        destination: "/:path*",
        permanent: true,
      },
      {
        source: "/guild/protein",
        destination: "/protein-community",
        permanent: true,
      },
      {
        source: "/guild/rose-hands",
        destination: "/mad-realities-dao",
        permanent: true,
      },
    ]
  },
}
