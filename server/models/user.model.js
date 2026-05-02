import { defineMongooseModel } from '#nuxt/mongoose'
import mongoose from 'mongoose'


const User = defineMongooseModel({
    name: 'User',
    schema: {
        _id: { type: mongoose.ObjectId, required: true },
        avatar: { type: String, required: false },
        username: { type: String, required: true },
        password: { type: String, required: true },
        nameFirst: { type: String, required: true },
        nameLast: { type: String, required: true },
        active: { type: Boolean, default: true },
        type: { type: String, required: true },
        status: { type: Number, required: true },
        isDirectory: { type: Boolean, default: false },
        hasOrca: { type: Boolean, default: false },
        created: { type: Date, default: Date.now },
        preferences: { type: {}, required: false },
        id: { type: String, required: true, unique: true }
    },
    options: {
        collection: 'users',
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    },
    hooks: (schema) => {
        schema.virtual('fullName').get(function () {
            return `${this.nameFirst} ${this.nameLast}`
        })
    }
})

export default User