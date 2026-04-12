export const useReceptionStore = defineStore('ReceptionStore', {
    state: () => ({
        pendingWalkIns: [],
        myNumberWalkins: [],

    }),
    actions: {
        async addPendingWalkIn() {
            // Add the patient to the pending walk-ins list
            const newPerson = {
                type: 'patient',
                status: 'pending',
            }

            this.pendingWalkIns.push({
                id: patientId,
                name: "Patient Name", // You can fetch the actual name using the patientId if needed
                checkInTime: new Date(),
            });
        },
    }
})