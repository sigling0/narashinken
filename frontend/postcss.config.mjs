const config = {
  plugins: [
    "@tailwindcss/postcss",
    // 本番環境でCSS圧縮を有効化
    ...(process.env.NODE_ENV === 'production' ? [
      [
        'cssnano',
        {
          preset: ['advanced', {
            discardComments: { removeAll: true },
            reduceIdents: false,
            zindex: false,
          }],
        },
      ],
    ] : []),
  ],
};

export default config;
