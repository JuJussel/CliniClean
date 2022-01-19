/*
    Permissions
    UI filter - routes are protectded on backend
    Array corresponds to 3 groups in this order: [Receptionist,Nurse,Doctor]
    Permission levels are: 0: no access, 1: read, 2; edit
    so [0,1,2] means: receptionist: no access, nurse: view access, doctor: edit access
*/

let config = {
    websocketUrl: "wss://" + window.location.hostname + ':3003', // Notification Server
    schemaUrl: "/assets/schemas/",
    assetsUrl: "/assets/", //Images
    filesUrl: "/files/", //User created assets
    googleMapsApiKey: 'Store in local file to avoid upload to version management',
    permissions: {
        dashboard: [2,2,2],
        reception: [2,1,2],
        patient: [2,1,2],
        medical: [0,1,2],
        order: [0,2,1]
    }
}

import local from "./local";
config = Object.assign(config, local);

export default config;