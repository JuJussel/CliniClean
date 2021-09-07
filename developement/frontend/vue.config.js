const fs = require('fs')

const path = require('path')

module.exports = {
  devServer: {
    https: {
      key: fs.readFileSync('/etc/pki/tls/certs/key.pem'),
      cert: fs.readFileSync('/etc/pki/tls/certs/cert.pem')
    },
    proxy: {
      '^/api': {
        target: 'http://localhost:3003',
        changeOrigin: true
      }
    }
  },
  configureWebpack: {
    resolve: {
      symlinks: false,
      alias: {
        vue: path.resolve('./node_modules/vue')
      }
    }
  }
}