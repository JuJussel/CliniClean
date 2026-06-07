import Patient from '../../models/patient.model'

export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, 'id').toString().padStart(5, '0');
        const body = await readBody(event);

        // Find patient in DB and update fields
        const patient = await Patient.findOneAndUpdate(
            { id },
            { $set: body },
            { new: true }
        );

        if (!patient) {
            throw createError({
                status: 404,
                statusMessage: 'Patient Not Found',
                message: `Patient with ID ${id} not found in database.`
            });
        }

        return {
            success: true,
            data: patient
        }
    } catch (error) {
        if (error.statusCode) {
            throw error;
        }
        console.error('[Patient Update API Error]', error);
        throw createError({
            status: 500,
            statusMessage: 'Internal Server Error',
            message: 'Failed to update patient data'
        });
    }
})
