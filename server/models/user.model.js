import { defineMongooseModel } from '#nuxt/mongoose'

const User = defineMongooseModel({
    name: 'User',
    schema: {
        _id: { type: String, required: true },
        avatar: { type: String, required: false },
        username: { type: String, required: true },
        password: { type: String, required: true },
        nameFirst: { type: String, required: true },
        nameLast: { type: String, required: true },
        active: { type: Boolean, default: true },
        userGroup: Number,
        status: { type: Number, required: true },
        isDirectory: { type: Boolean, default: false },
        hasOrca: { type: Boolean, default: false },
        created: { type: Date, default: Date.now },
        preferences: { type: {}, required: false }
    },
    options: {
        collection: 'users',
    }
})

export default User