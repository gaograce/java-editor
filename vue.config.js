const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

module.exports = {
  // ......
  devServer: {
    disableHostCheck: true,
    port: 29999
  },
  chainWebpack: config => {
    config.module
           .rule('images')
           .use('url-loader')
           .loader('url-loader')
           .tap(options => Object.assign(options, { limit: 0 }))
  },
  configureWebpack: {
    resolve: {
        alias : {
            'vscode': require.resolve('monaco-languageclient/lib/vscode-compatibility')
        }
    },
    plugins: [
      new MonacoWebpackPlugin({
        // available options are documented at https://github.com/Microsoft/monaco-editor-webpack-plugin#options
        languages: ['javascript', 'css', 'html', 'typescript', 'json', 'java']
      })
    ]
  }
}