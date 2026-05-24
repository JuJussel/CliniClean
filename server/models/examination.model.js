import { defineMongooseModel } from '#nuxt/mongoose'

const Examination = defineMongooseModel({
    name: 'Examination',
    schema: {
        _id: { type: String },
        JLACCodeShort: { type: String },
        JLACCodeLong: { type: String },
        item: {
            flag: { type: String },
            code: { type: String },
            name: { type: String }
        },
        itemDetail: {
            flag: { type: String },
            code: { type: String },
            name: { type: String }
        },
        sample: {
            flag: { type: String },
            code: { type: String },
            name: { type: String }
        },
        method: {
            flag: { type: String },
            code: { type: String },
            name: { type: String }
        },
        result: {
            shared: {
                flag: { type: String },
                code: { type: String },
                name: { type: String }
            },
            single: {
                flag: { type: String },
                name: { type: String }
            }
        },
        combinedCode: { type: String },
        defaultName: { type: String },
        unit: {
            code: { type: String },
            name: { type: String }
        },
        insuranceIncluded: { type: String },
        procedure: {
            code: { type: String },
            name: { type: String },
            name2: { type: String },
        },
        points: { type: String },
        section: { type: String },
        classCode: { type: String },
        itemCode: { type: String },
        changeDate: { type: String }
    },
    options: {
        collection: 's_examinations',
        toJSON: { virtuals: true },
    }
})

export default Examination
