import Patient from '../../../models/patient.model.js';
import Encounter from '../../../models/encounter.model.js';
import Allergy from '../../../models/allergy.model.js';

export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, 'id').toString().padStart(5, '0');
        const body = await readBody(event);

        const { encounterId, category, code, name, startDate, endDate, severity, comment } = body;

        // Validation
        if (!encounterId) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'encounterId is required'
            });
        }

        if (!category || !['allergies', 'medicationAllergies'].includes(category)) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'category must be either "allergies" or "medicationAllergies"'
            });
        }

        if (!code || !name) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'Allergy code and name are required'
            });
        }

        if (!startDate) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'startDate is required'
            });
        }

        // Find patient in DB first to get MongoDB ObjectId
        const patientDoc = await Patient.findOne({ id });
        if (!patientDoc) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Patient Not Found',
                message: `Patient with ID ${id} not found in database.`
            });
        }

        // Fetch encounter to check status
        const encounter = await Encounter.findById(encounterId);
        if (!encounter) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Not Found',
                message: 'Encounter not found'
            });
        }

        // Allergies can only be added when encounter status is 3 (in progress)
        if (encounter.status !== 3) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'Allergies can only be registered if the encounter status is active (status 3)'
            });
        }

        // Create and save allergy entry
        const allergyEntry = new Allergy({
            patient: patientDoc._id,
            encounter: encounter._id,
            category,
            code,
            name,
            startDate: new Date(startDate),
            endDate: endDate ? new Date(endDate) : undefined,
            severity: severity || undefined,
            comment: comment || "",
            recordedBy: event.context.auth?.user?.id || event.context.auth?.user?._id || (await getUserSession(event))?.user?.id || (await getUserSession(event))?.user?._id || null
        });

        await allergyEntry.save();

        return {
            success: true,
            data: allergyEntry
        };

    } catch (error) {
        if (error.statusCode) {
            throw error;
        }

        console.error('[Patient Allergy POST API Error]', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
            message: error.message || 'Failed to record patient allergy'
        });
    }
});
