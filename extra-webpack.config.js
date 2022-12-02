const path = require('path');
const webpack = require('webpack');

module.exports = {
  resolve: {
    alias: {
      'proxy-polyfill': path.resolve(__dirname, 'node_modules/proxy-polyfill/proxy.min.js'),
      // 'jsonld': path.resolve(__dirname, 'node_modules/jsonld/dist/node6/lib/jsonld.js') // NOTE: Used to force jsonld 1.6.2 "babelished" version into use
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                "@babel/preset-env",
                "@babel/preset-typescript"
              ],
              plugins: [
                 ["@babel/plugin-proposal-decorators",
                  {
                    "legacy": true
                  }
                ],
                "@babel/plugin-proposal-class-properties",
                ["angularjs-annotate", { "explicitOnly": true }]
              ]
            }
          }
        ]
      },
      {
        test: /\.html$/, exclude: /node_modules/, loader: 'html-loader'
      }
    ]
  },
  plugins: [
  ]
};
