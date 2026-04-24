module.exports = function (api) {
  api.cache(true);
  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'react' }]],
    plugins: [
      // react-native-worklets/plugin MUST be listed last.
      // In Reanimated v4+ the babel plugin was extracted into the
      // react-native-worklets package; using the old 'react-native-reanimated/plugin'
      // path produces broken worklet transforms and bundle-level syntax errors.
      'react-native-worklets/plugin',
    ],
  };
};
