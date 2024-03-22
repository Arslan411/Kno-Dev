module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          alias: {
            src: "./src",
            components: "./src/components",
            navigation: "./src/navigation",
            store: "./src/store",
            screens: "./src/screens",
            types: "./src/types",
            assets: "./src/assets",
            constants: "./src/constants",
            services: "./src/services",
            data: "./src/data",
            utils: "./src/utils",
          },
        },
      ],
    ],
  };
};
