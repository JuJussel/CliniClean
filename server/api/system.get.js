import system from "../models/system.model.js";
import user from "../models/user.model.js";
import settings from '../models/setting.model.js'

export default defineEventHandler(async (event) => {
    try {

        const uiData = await system.findOne({ category: 'ui' }).lean()
        const doctors = await user.find({ type: 'doctor', active: true }).select('nameLast nameFirst _id status')
        const appSettings = await settings.findOne().lean()

        const data = {
            ui: uiData?.data || {},
            doctors: doctors || [],
            settings: appSettings?.data || {}
        }


        return {
            success: true,
            data
        }
    } catch (error) {
        if (error.statusCode) {
            throw error
        }

        console.error('[System API Error]', {
            error: error.message,
            stack: error.stack
        })

        throw createError({
            status: 500,
            statusMessage: 'Internal Server Error',
            message: 'Failed to fetch system data'
        })
    }
})