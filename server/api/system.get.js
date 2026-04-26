import system from "../models/system.model.js";
import user from "../models/user.model.js";

export default defineEventHandler(async (event) => {
    try {

        const systemData = await system.find({ category: { $in: ['ui', 'config'] } }).lean()
        const doctors = await user.find({ type: 'doctor', active: true }).select('nameLast nameFirst _id status')

        const data = {
            ui: systemData.find((item) => item.category === 'ui')?.data || {},
            config: systemData.find((item) => item.category === 'config')?.data || {},
            doctors: doctors || []
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