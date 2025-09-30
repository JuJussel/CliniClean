import { defineStore } from 'pinia'
import useApi from "@/composables/apiComposable.js";
import dayjs from "dayjs";

export const useReceptionStore = defineStore({
    id: 'Reception',
    persist: {
        enabled: false
    },
    /////////////////////////////////////////////////////////////////////////////////////
    // STATE
    /////////////////////////////////////////////////////////////////////////////////////
    state: () => {
        return {
            loading: {
                schedule: false
            },
            scheduleData: [],
            selectedEncounter: null,
            multiView: {
                mode: null,
                data: {
                    patient: null
                }
            }
        }
    },
    /////////////////////////////////////////////////////////////////////////////////////
    // ACTIONS
    /////////////////////////////////////////////////////////////////////////////////////
    actions: {
        async setScheduleData(range = [dayjs().startOf("day"), dayjs().endOf("day")]) {
            this.loading.schedule = true
            const searchRange = "start=" + range[0].$d + "&end=" + range[1].$d;
            this.scheduleData = await useApi.get("encounters/range?" + searchRange);
            this.loading.schedule = false
        }
    }
})

export default useReceptionStore