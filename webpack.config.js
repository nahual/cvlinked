var path = require('path')
var webpack = require('webpack')
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  mode: 'development',
  entry: './src/web/index.ts',
  output: {
    path: path.resolve(__dirname, './public'),
    publicPath: '/public/',
    filename: 'build.js'
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        enforce: 'pre',
        use: [
          {
            options: {
              eslintPath: require.resolve('eslint'),
            },
            loader: require.resolve('eslint-loader'),
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.tsx?$/,
        exclude: [
          /node_modules/,
        ],
        use: {
          loader: 'ts-loader',
          options: {
            appendTsSuffixTo: [/\.vue$/],
          }
        }
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          'vue-style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: false,
            }
          }
        ]
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'vue-style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: false
            }
          },
          {
            loader: 'sass-loader',
            options: {
              implementation: require("sass"),
            }
          }
        ]
      },
      {
        test: /\.vue$/,
        use: {
          loader: 'vue-loader',
          options: {
            loaders: {
              'scss': 'vue-style-loader!css-loader!sass-loader',
              'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax',
            }
          }
        }
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]?[hash]'
          }
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  performance: {
    hints: false
  },
  devtool: 'inline-source-map'
}

if (process.env.NODE_ENV === 'production') {
  module.exports.mode = 'production',
  module.exports.devtool = false
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: 'production'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}