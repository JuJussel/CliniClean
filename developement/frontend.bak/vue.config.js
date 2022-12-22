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
        target: 'https://localhost:3003',
        changeOrigin: true
      },
      '^/assets': {
        target: 'https://localhost:3003',
        changeOrigin: true
      },
      '^/files': {
        target: 'https://localhost:3003',
        changeOrigin: true
      }
    }
  },
  configureWebpack: {
    resolve: {
      symlinks: false,
      alias: {
        vue: path.resolve('./node_modules/vue'),
        src: path.resolve(__dirname, 'src')
      }
    }
  }
}