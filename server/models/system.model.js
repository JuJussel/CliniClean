import { defineMongooseModel } from '#nuxt/mongoose'

const System = defineMongooseModel({
    name: 'System',
    schema: {
        lists: { type: {} }
    },
    options: {
        collection: 'system',
    }
})

export default System