const path = require('path');
const config = require('./config');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

// load env vars from .env file
require('dotenv').config();
console.log(process.env);

/* ----------------------------
 * configs that takes care of bundling the files
 * into one single file and setting up the dev server
 * ----------------------------
 * "output.entry": "./index.js"
 * -> "resolve": check for all  (files with extensions)
 * -> "rules": apply to files (loaders; transform)
 * -> "output.path": "dist"
 * -> "output.filename": "bundle.js"
 * -> "plugins.HtmlWebpackPlugin": output.path/index.html
 */

const mode = process.env.NODE_ENV || 'development';
const isProduction = mode === 'production';

assetsPath = function (_path) {
  var assetsSubDirectory = isProduction
    ? config.build.assetsSubDirectory
    : config.build.assetsSubDirectory;
  return path.posix.join(assetsSubDirectory, _path);
};

let webpackConfig = {
  mode: mode,
  devtool: isProduction ? 'source-map' : 'eval-source-map',
  entry: './src/index.js',
  output: {
    path: config.build.assetsRoot,
    publicPath: config.build.assetsPublicPath, // where assets will be served relative to path
    // https://github.com/webpack/docs/wiki/long-term-caching
    filename: assetsPath('js/[name].[chunkhash].js'), // unique has per initial chunk (entry, runtime, vendor...)
    chunkFilename: assetsPath('js/[name].bundle.[chunkhash].js'), // unique has per dynamic chunk (ie. a reusable dependency)
    assetModuleFilename: assetsPath('assets/[name].[hash:7][ext][query]'),
    clean: true // clean .<path>/ before compiling
  },
  target: 'web', // "web": client side, "node": server side
  // config the dev server
  devServer: {
    port: '8002',
    static: ['./dist'], // from where static file should be served
    open: true, // open browser on start
    liveReload: true,
    hot: true, // Hot Module Replacement
    allowedHosts: 'all' // for use with ngrok, disables host check
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.css']
  },
  module: {
    // specify loader for require()/import statements in "resolve.extensions" files
    rules: [
      {
        test: /\.(js|jsx)$/, // include for test for this rule
        exclude: /node_modules/, // don't search here for loader
        use: 'babel-loader' // specific loader we use for transpiling
      },
      // assets: css
      {
        test: /\.css$/,
        use: [
          isProduction
            ? MiniCssExtractPlugin.loader // create css files in build that can be loaded async at import
            : 'style-loader', // inject style tag into js
          'css-loader' // import css in js files
        ] //  and also load into DOM
      },
      // assets: fonts
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: 'asset/resource',
        generator: {
          filename: assetsPath('fonts/[name].[hash:7][ext]')
        }
      },
      // assets: images
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/,
        type: 'asset/resource',
        generator: {
          filename: assetsPath('images/[name].[hash:7][ext]')
        }
      }
    ]
  },
  plugins: [
    // This plugin extracts CSS into separate files.
    // It creates a CSS file per JS file which contains CSS.
    // It supports On-Demand-Loading of CSS and SourceMaps.
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash].css',
      chunkFilename: 'static/css/[id].[hash].css'
    }),
    // will generate html referring the generated js scripts
    // useful for webpack bundles that include a hash in the generated js filename(s) which changes every compilation.
    // => generates: output.path/index.html
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.join(__dirname, 'templates/index.html') // template html to build from
    }),
    // Copies individual files or entire directories, which already exist, to the build directory.
    // copy static/ contents dir to distribution assets dir (dist/static/**)
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'static'),
          to: config.build.assetsSubDirectory,
          globOptions: {
            ignore: ['**/docs/**']
          }
        }
      ]
    }),
    new Dotenv()
  ],
  // https://webpack.js.org/guides/caching/
  // https://gist.github.com/sokra/1522d586b8e5c0f5072d7565c2bee693#configurate-cache-groups
  optimization: {
    nodeEnv: mode,
    minimizer: [
      new TerserPlugin({
        extractComments: false
      })
    ],
    /*
     * each vendor module's id is determined by its order of resolving by default (indeterminate).
     * this causes the content hash to change on each build, even if nothing changed.
     *
     * Now our "vendor" hash should stay consistent between builds
     */
    moduleIds: 'deterministic', // deterministic module id based on filename
    /*
     * chunk runtime into a "runtime" chunk...
     * aim is to separate out re-caching babel runtime with low frequency changes compared to source code.
     * https://webpack.js.org/concepts/manifest/#runtime
     * includes a manifest
     */
    runtimeChunk: 'single', // split runtime code into "runtime" chunk
    /*
     * split dependencies into a "vendors" and "styles" chunks...
     * aim is to separate out re-caching dependencies with low frequency changes compared to source code.
     */
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors', // name of the dependencies chunk,
          chunks: 'all', // include all types of chunks (sync & async)
          enforce: true
        },
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },

  performance: {
    maxEntrypointSize: 512000, // set size limits on entry bundles
    maxAssetSize: 512000 // set size limits on asset bundles
  }
};

// lint in development mode
if (mode === 'development' && !!process.env.NPM_CONFIG_LINT === true) {
  const ESLintPlugin = require('eslint-webpack-plugin');
  webpackConfig.plugins.push(new ESLintPlugin());
}

// generate a bundle webpack report only if necessary
// generally only need to inspect production builds, but don't want to generate every time as it will impact build performance.
if (!!process.env.NPM_CONFIG_REPORT === true) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
  webpackConfig.plugins.push(
    new BundleAnalyzerPlugin({
      analyzerMode: process.env.NPM_CONFIG_REPORT_MODE || 'static'
    })
  );
}

module.exports = webpackConfig;
