const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');
config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== 'svg');
config.resolver.sourceExts.push('svg');

module.exports = config;

// Enable Fast Refresh and improve development experience
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Improve hot reload behavior
config.server = {
  ...config.server,
  rewriteRequestUrl: (url) => {
    if (!url.endsWith('.bundle')) {
      return url;
    }
    // You can customize URL rewriting here if needed
    return url;
  },
};

// Better error handling for development
config.transformer = {
  ...config.transformer,
  minifierConfig: {
    keep_fnames: true,
    mangle: {
      keep_fnames: true,
    },
  },
};

// Ensure proper asset resolution
config.resolver.assetExts.push(
  'db', 'mp3', 'ttf', 'obj', 'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'
);

module.exports = config; 