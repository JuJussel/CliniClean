import Encounter from "../../models/encounter.model.js";

export default defineEventHandler(async (event) => {
    const _id = event.context.params.encounterId
    try {
        const encounter = await Encounter.findOne({_id})
            .populate('patient', 'name.family name.given id')
            .populate('doctor', 'nameLast nameFirst _id')
            .lean()
        return encounter
    } catch (err) {
        console.error(err)
        throw createError({
            status: 500,
            statusMessage: 'Database Error',
            message: 'An error occurred while fetching encounters'
        })
    }
})