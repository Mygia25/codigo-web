const path = require('path');

module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        "fs": false,
        "tls": false,
        "net": false,
        "path": false,
        "zlib": false,
        "http": false,
        "https": false,
        "stream": false,
        "crypto": false,
       };
    }
    config.resolve.alias['handlebars'] = path.resolve(__dirname, 'node_modules/handlebars/dist/handlebars.min.js')
    return config;
  },
};