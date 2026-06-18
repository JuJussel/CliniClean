import { getPatientDiseases } from '../../../utils/orcaApiConnector.js';

export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, 'id').toString().padStart(5, '0');
        const { date } = getQuery(event);
        const baseDate = date ? new Date(date) : new Date();

        // Validate patient ID
        if (!id || typeof id !== 'string') {
            throw createError({
                status: 400,
                statusMessage: 'Invalid Patient ID',
                message: 'Patient ID is required'
            });
        }

        const diseaseResult = await getPatientDiseases(id, baseDate);
        if (!diseaseResult.success) {
            throw createError({
                status: 502,
                statusMessage: 'Bad Gateway',
                message: `ORCA Disease Error: ${diseaseResult.message}`
            });
        }

        return {
            success: true,
            data: diseaseResult.diseases
        };

    } catch (error) {
        if (error.statusCode) {
            throw error;
        }

        console.error('[Patient Disease GET API Error]', error);
        throw createError({
            status: 500,
            statusMessage: 'Internal Server Error',
            message: 'Failed to fetch patient diseases from ORCA'
        });
    }
});
