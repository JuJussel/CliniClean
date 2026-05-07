import Encounter from "../../models/encounter.model.js";

export default defineEventHandler(async (event) => {
    const { start, end } = getQuery(event)

    if (!start || !end) {
        throw createError({
            status: 400,
            statusMessage: 'Invalid Query Parameters',
            message: 'Both start and end query parameters are required'
        })
    }

    try {
        const encounters = await Encounter.find({
            date: {
                $gte: new Date(start),
                $lte: new Date(end)
            }
        })
            .populate('patient', 'name.family name.given id')
            .populate('doctor', 'nameLast nameFirst _id')
            .lean()

            encounters.forEach(encounter => {
                encounter.title = `${encounter.patient?.name?.family || ''} ${encounter.patient?.name?.given?.[0] || ''} `
                encounter.start = encounter.date
                encounter.end = new Date(new Date(encounter.date).getTime() + 30 * 60 * 1000) // Default to 30 min duration
            })
            
        return encounters
    } catch (err) {
        console.error(err)
        throw createError({
            status: 500,
            statusMessage: 'Database Error',
            message: 'An error occurred while fetching encounters'
        })
    }
})