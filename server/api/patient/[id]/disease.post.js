import { registerPatientDisease } from '../../../utils/orcaApiConnector.js';
import Encounter from '../../../models/encounter.model.js';

export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, 'id').toString().padStart(5, '0');
        const body = await readBody(event);

        const { encounterId, diseases } = body;

        // Validation
        if (!encounterId) {
            throw createError({
                status: 400,
                statusMessage: 'Bad Request',
                message: 'encounterId is required'
            });
        }

        if (!diseases || !Array.isArray(diseases) || diseases.length === 0) {
            throw createError({
                status: 400,
                statusMessage: 'Bad Request',
                message: 'diseases list is required and cannot be empty'
            });
        }

        // Fetch encounter to check status and get date/doctor
        const encounter = await Encounter.findById(encounterId).populate('doctor');
        if (!encounter) {
            throw createError({
                status: 404,
                statusMessage: 'Not Found',
                message: 'Encounter not found'
            });
        }

        // Diseases can only be added when encounter status is 3 (activeReception)
        if (encounter.status !== 3) {
            throw createError({
                status: 400,
                statusMessage: 'Bad Request',
                message: 'Diseases can only be registered if the encounter status is active (status 3)'
            });
        }

        // Call ORCA API connector
        const result = await registerPatientDisease(
            id,
            encounter.date,
            encounter.department || '01',
            diseases
        );

        if (!result.success) {
            throw createError({
                status: 502,
                statusMessage: 'Bad Gateway',
                message: `ORCA Disease Error: ${result.message}`
            });
        }

        return {
            success: true,
            data: result.data
        };

    } catch (error) {
        if (error.statusCode) {
            throw error;
        }

        console.error('[Patient Disease POST API Error]', error);
        throw createError({
            status: 500,
            statusMessage: 'Internal Server Error',
            message: error.message || 'Failed to save patient disease in ORCA'
        });
    }
});
