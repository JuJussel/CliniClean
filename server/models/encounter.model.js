import { defineMongooseModel } from '#nuxt/mongoose'

const Encounter = defineMongooseModel({
    name: 'Encounter',
    schema: {
        patient: { type: Number, ref: "patients", required: true },
        type: { type: Number, required: true },
        ins: String,
        receptionMemo: String,
        baseCost: [{}],
        date: { type: Date, default: Date.now() },
        // 1: reservation, 2: waiting, 3: in progress, 4: payment, 5: completed
        // 99: cancelled
        status: { type: Number, required: true, default: 2 },
        endDate: Date,
        locked: Boolean,
        doctor: String,
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
        editHistory: [{ type: mongoose.ObjectId, ref: "encounters" }],
        lastChange: { type: Date, default: Date.now },
        payment: {}
    },
    options: {
        collection: 'encounters',
    }
})

export default Encounter