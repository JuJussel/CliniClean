const secrets = require ('./secret')

module.exports = {
    url: 'http://192.168.1.200:8000',
    user: 'ormaster',
    pass: secrets.orcaApiPass,
    kenkoushindan_code: 095110001
}