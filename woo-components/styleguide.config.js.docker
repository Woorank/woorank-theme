var path = require('path');
module.exports = {
  title: 'Woo-components',
  components: './woo-components/src/components/**/*.jsx',
  serverHost: '0.0.0.0',
  updateWebpackConfig: function (webpackConfig, env) {
    const dir = path.join(__dirname, 'woo-components/src');
    webpackConfig.module.loaders.push(
      {
        test: /\.jsx?$/,
        include: dir,
        loader: 'babel'
      },
      {
        test: /\.scss$/,
        include: dir,
        loaders: ['style', 'css', 'sass']
      },
      {
        test: /\.scss$/,
        include: path.join(__dirname, 'woo-theme/src/sass'),
        loaders: ['style', 'css', 'sass']
      },
      {
        test: /\.svg$/,
        include: path.join(__dirname, 'woo-theme'),
        loader: require.resolve('file-loader') + '?name=../[path][name].[ext]'
      },
      {
        test: /\.woff$/,
        include: path.join(__dirname, 'woo-theme'),
        loader: require.resolve('file-loader') + '?name=../[path][name].[ext]'
      },
      {
        test: /\.woff2$/,
        include: path.join(__dirname, 'woo-theme'),
        loader: require.resolve('file-loader') + '?name=../[path][name].[ext]'
      },
      {
        test: /\.[ot]tf$/,
        include: path.join(__dirname, 'woo-theme'),
        loader: require.resolve('file-loader') + '?name=../[path][name].[ext]'
      },
      {
        test: /\.eot$/,
        include: path.join(__dirname, 'woo-theme'),
        loader: require.resolve('file-loader') + '?name=../[path][name].[ext]'
      }
    );

    webpackConfig.entry.push(path.join(__dirname, 'woo-components/src/sass/woo-components.scss'));
    webpackConfig.entry.push(path.join(__dirname, 'woo-theme/src/sass/woorank-theme.scss'));

    return webpackConfig;
  }
};
