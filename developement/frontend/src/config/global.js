// const configElement = document.getElementById( 'config' ); //Pass data from PHP in index.html
const url = window.location.hostname
const apiPort = '3003'

export default {
  apiUrl: url,
  apiPort: apiPort,
  apiURL: 'https://' + url + ':' + apiPort + '/api/', // APi
  socketIOIP: 'https://' + url + ':1337', // Notification Server
  schemaUrl: 'https://' + url + '/assets/schemas/',
  mapUrl: 'https://' + url + '/maps/tileserver.php',
  assetsUrl: 'https://' + url + '/assets/', //Images
  filesUrl: 'https://' + url + ':' + apiPort + '/files/',//User created assets
}