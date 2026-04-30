import Encounter from "../../models/encounter.model.js";

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)

        const encounter = new Encounter(body)
        await encounter.save()
        return encounter
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: error.message
        })
    }
})

