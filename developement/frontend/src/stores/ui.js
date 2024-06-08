import { defineStore } from 'pinia'
import { socket } from "@/utils/socket.js";

export const useUiStore = defineStore({
    id: 'ui',
    persist: {
        enabled: true
    },
    state: () => {
        return {
            websocketConnected: false,
            loading: false,
            activeTab: shallowRef(null),
            medicalTab: null,
            receptionTab: null,
            orderTab: null,
            modals: {
                receptionModalRegister: false,
                receptionModalReservation: false,
                receptionModalPatientEdit: false,
                receptionModalInsuranceEdit: false
            },
            notification: []
        }
    },
    actions: {
        bindEvents() {
            socket.on("connect", () => {
                this.websocketConnected = true;
            });

            socket.on("disconnect", () => {
                this.websocketConnected = false;
            });

            socket.on("notificationUpdate"), (data) => {
                console.log(data);
            }
        },
        connect() {
            socket.connect();
        }
    },
})

export default useUiStore