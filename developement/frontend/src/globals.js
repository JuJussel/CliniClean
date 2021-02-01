const configElement = document.getElementById( 'config' );
const url = window.location.hostname

export default {
  apiIP: url,
  apiURL: 'https://' + url + '/api/', // Middleware
  socketIOIP: 'https://' + url + ':1337', // Notification Server
  fileUploadURL: '/cliniclean/cliniclean/API/v3/insert/common/uploadFile.php', // needed fo file upload since cannot use a function
  schemaUrl: 'https://' + url + '/assets/schemas/',
  mapUrl: 'https://' + url + '/maps/tileserver.php',
  assetsUrl: 'https://' + url + '/assets/', //Images
  filesUrl: 'https://' + url + '/files/',//User created assets
  theme: {
    colors: {
      darkGray: '#2c3e50'
    }
  }
}
