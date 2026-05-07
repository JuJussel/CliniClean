import { sseEvents } from "../../utils/sse"
import Encounter from "../../models/encounter.model.js";

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)

        const encounter = new Encounter(body)
        await encounter.save()

        // Broadcast SSE message to all connected clients
        sseEvents.emit('publish', {
            event: 'encounterCreated',
            action: 'updateReceptionList',
            message: {encounter},
            timestamp: new Date().toISOString()
        })

        return {
            success: true,
            data: encounter
        }
    } catch (error) {
        if (error.statusCode) {
            throw error
        }

        console.error('[Encounter Create API Error]', {
            error: error.message,
            stack: error.stack
        })

        throw createError({
            status: 500,
            statusMessage: 'Internal Server Error',
            message: 'Failed to create encounter'
        })
    }
})

