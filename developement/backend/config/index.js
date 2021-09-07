const fs = require('fs');
const Path = require('path');
const localConfigPath = Path.join(__dirname, 'local.json');

let config = require( './default.json');

if (fs.existsSync(localConfigPath)) {
    const localConfig = require('./local.json');
    config = Object.assign(config, localConfig);
}

module.exports = config;