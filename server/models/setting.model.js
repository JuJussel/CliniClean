import { defineMongooseModel } from '#nuxt/mongoose'

const Settings = defineMongooseModel({
    name: 'Settings',
    schema: {
        category: String,
        data: Object
    },
    options: {
        collection: 'settings',
    }
})

export default Settings