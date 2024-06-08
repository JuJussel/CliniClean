import { io } from "socket.io-client";
const settingStore = useSettingStore()

// "undefined" means the URL will be computed from the `window.location` object
const URL = settingStore.settingData.url

export const socket = io(URL);