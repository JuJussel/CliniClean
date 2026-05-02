import mongoose from 'mongoose'
import { defineMongooseModel } from '#nuxt/mongoose'
import User from "./user.model.js";
import Patient from "./patient.model.js";

const Encounter = defineMongooseModel({
    name: 'Encounter',
    schema: {
        patient: { type: mongoose.ObjectId, ref: Patient, required: true },
        // Reception type: 1: General, 2: PrevVaccination, 3: Follow-up, 4: Telemedicine, 5: Home Visit, 6: HealthCheckup, 7: Other
        type: { type: Number, required: true, default: 1 },
        ins: String,
        receptionMemo: String,
        baseCost: [{}],
        date: { type: Date, default: Date.now() },
        // 1: reservation, 2: waiting, 3: in progress, 4: payment, 5: completed
        // 99: cancelled
        status: { type: Number, required: true, default: 2 },
        endDate: Date,
        locked: Boolean,
        doctor: { type: mongoose.ObjectId, ref: User, required: true },
        karte:
        {
            soap: { type: String, default: "" },
            procedures: { type: [{}], default: [] },
            images: [
                { type: mongoose.ObjectId, ref: "files" }
            ]
        },
        department: { type: String, default: '01' },
        examinationStart: Date,
        examinationEnd: Date,
        editHistory: [{ type: mongoose.ObjectId, ref: "Encounter" }],
        lastChange: { type: Date, default: Date.now },
        payment: {}
    },
    options: {
        collection: 'encounters',
    }
})

export default Encounter