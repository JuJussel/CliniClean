let config = {
    websocketUrl: "wss://" + window.location.hostname + ':3003', // Notification Server
    schemaUrl: "/assets/schemas/",
    assetsUrl: "/assets/", //Images
    filesUrl: "/files/", //User created assets
    googleMapsApiKey: 'Store in local file to avoid upload to version management'
}

import local from "./local";
config = Object.assign(config, local);

export default config;