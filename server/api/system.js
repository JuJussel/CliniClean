import system from "../models/system.model.js";

export default defineEventHandler(async (event) => {
    try {

        const systemData = await system.find({ category: { $in: ["ui", "config"] } }).lean()

        const data = {
            ui: systemData.find((item) => item.category === "ui")?.data || {},
            config: systemData.find((item) => item.category === "config")?.data || {},
        }
        return { data }
    } catch (e) {
        throw createError({
            status: 500,
            message: 'Failed to fetch system data',
        })
    }
})