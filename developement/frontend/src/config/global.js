let config = {
    websocketUrl: "wss://" + window.location.hostname + ':3003', // Notification Server
    schemaUrl: "/assets/schemas/",
    assetsUrl: "/assets/", //Images
    filesUrl: "/files/", //User created assets
}

import local from "./local";
config = Object.assign(config, local);

export default config;