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
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin({ banner: "#!/usr/bin/env node", raw: true }),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  ignoreWarnings: [
    {
      module: /^(?!CriticalDependenciesWarning$)/
    }
  ]
};

