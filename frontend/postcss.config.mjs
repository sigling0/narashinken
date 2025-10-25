const config = {
  plugins: {
    "@tailwindcss/postcss": {},
    // 常にcssnanoを適用（Vercelビルドで確実に動作させる）
    'cssnano': {
      preset: ['advanced', {
        discardComments: { removeAll: true },
        reduceIdents: false,
        zindex: false,
        mergeLonghand: true,
        mergeRules: true,
        minifySelectors: true,
        minifyParams: true,
        normalizeWhitespace: true,
        colormin: true,
        convertValues: true,
        discardDuplicates: true,
        discardEmpty: true,
        discardOverridden: true,
      }],
    },
  },
};

export default config;
