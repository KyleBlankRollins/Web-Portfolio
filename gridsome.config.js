// This is where project configuration and plugin options are located. 
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

module.exports = {
  siteName: 'The Canney Valley',
  // icon: {
  //   favicon: {
  //     src: './src/assets/favicon.png',
  //     sizes: [16, 32, 96]
  //   }
  // },
  transformers: {
    remark: {
      externalLinksTarget: '_blank',
      externalLinksRel: ['nofollow', 'noopener', 'noreferrer'],
      anchorClassName: 'icon icon-link',
      plugins: [
        // ...global plugins
      ]
    }
  },
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          require("tailwindcss")("tailwind.js"),
          require("autoprefixer")()
        ],
      },
    },
  },
  plugins: [
    {
      use: '@gridsome/source-filesystem',
      options: {
        path: 'posts/**/*.md',
        typeName: 'Post',
        remark: {
          plugins: [
            // ...local plugins
          ]
        },
        refs: {
          tags: {
            typeName: "Tag",
            route: "/tag/:id",
            create: true
          },
          categories: {
            typeName: "Category",
            route: "/category/:id",
            create: true
          }
        }
      }
    },
    {
      use: `gridsome-plugin-netlify-cms`,
      options: {
        publicPath: `/admin`
      }
    },
  ]
}
