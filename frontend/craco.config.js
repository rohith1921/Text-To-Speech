module.exports = {
    style: {
      postcss: {
        plugins: [
          require('postcss-import')({
            path: ['src/style'],
            filter: (path) => !path.includes('tailwindcss')
          }),
          require('tailwindcss'),
          require('autoprefixer'),
        ],
      },
    },
  };
