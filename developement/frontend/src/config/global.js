// const configElement = document.getElementById( 'config' ); //Pass data from PHP in index.html
const url = window.location.hostname
const apiPort = ':3003' //port not needed in production - set to ''
export default {
  apiUrl: url,
  apiPort: apiPort,
  apiURL: 'https://' + url + apiPort + '/api/', // APi
  socketIOIP: 'https://' + url + ':1337', // Notification Server
  schemaUrl: 'https://' + url + apiPort + '/assets/schemas/',
  assetsUrl: 'https://' + url + '/assets/', //Images
  filesUrl: 'https://' + url + apiPort + '/files/', //User created assets,
  httpCredPol: 'include' //Use include during dev. In production change to 'same-origin'
}