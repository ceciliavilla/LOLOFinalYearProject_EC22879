/*module.exports = function (api) {
    api.cache(true);
    return {
      presets: ['babel-preset-expo'],
      plugins: ['expo-router/babel', ],
    };
  };*/
  
  module.exports = function (api) {
    api.cache(true);
    return {
      presets: ['babel-preset-expo'],
      plugins: [
        ["module:react-native-dotenv", {
          "moduleName": "@env",
          "path": ".env",
        }]
      ]
    };
  };
  