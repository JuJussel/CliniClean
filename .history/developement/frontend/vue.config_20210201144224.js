module.exports = {
  assetsDir: '/assets'
}
const fs = require('fs')
const path = require('path');

module.exports = {
  assetsDir: 'assets',
  devServer: {
    https: {
      key: fs.readFileSync('.var/pki/tls/certs/key.pem'),
      cert: fs.readFileSync('.var/pki/tls/certs/cert.pem')
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        vue$: path.resolve('./node_modules/vue/dist/vue.runtime.esm.js'),
      },
    },
  },
}