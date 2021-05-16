// const configElement = document.getElementById( 'config' ); //Pass data from PHP in index.html
const url = window.location.hostname

export default {
  apiIP: url,
  apiURL: 'https://' + url + '/api/', // Middleware
  socketIOIP: 'https://' + url + ':1337', // Notification Server
  schemaUrl: 'https://' + url + '/assets/schemas/',
  mapUrl: 'https://' + url + '/maps/tileserver.php',
  assetsUrl: 'https://' + url + '/assets/', //Images
  filesUrl: 'https://' + url + '/files/',//User created assets
}