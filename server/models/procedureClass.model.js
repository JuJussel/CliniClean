import { defineMongooseModel } from '#nuxt/mongoose'

const ProcedureClass = defineMongooseModel({
    name: 'ProcedureClass',
    schema: {
        _id: String,
        name: String
    },
    options: {
        collection: 'sys_procedure_classes'
    }
})

export default ProcedureClass
