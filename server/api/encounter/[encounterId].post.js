import Encounter from '../../models/encounter.model';

export default defineEventHandler(async (event) => {
    const encounterId = event.context.params.encounterId;
    const body = await readBody(event);

    try {
        await Encounter.updateOne({ _id: encounterId }, body);
        return {
            success: true,
        };
    } catch (error) {
        if (error.statusCode) {
            throw error
        }
        console.error('[Encounter Update API Error]', error);
        throw createError({
            status: 500,
            statusMessage: 'Internal Server Error',
            message: error.message || 'Failed to update encounter'
        })
    }
}); 