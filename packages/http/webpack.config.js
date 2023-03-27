const webpack = require('webpack');

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: "{{name}}",
    libraryTarget: 'this'
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: ['ts-loader']
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin({ banner: "#!/usr/bin/env node", raw: true }),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  stats: {
    warningsFilter: /^(?!CriticalDependenciesWarning$)/
  }
};

