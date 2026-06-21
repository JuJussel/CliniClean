import Patient from '../../../models/patient.model.js';
import Allergy from '../../../models/allergy.model.js';

export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, 'id').toString().padStart(5, '0');

        // Validate patient ID
        if (!id || typeof id !== 'string') {
            throw createError({
                statusCode: 400,
                statusMessage: 'Invalid Patient ID',
                message: 'Patient ID is required'
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

        // Find allergies matching the patient's MongoDB ObjectId
        const allergies = await Allergy.find({ patient: patientDoc._id })
            .populate('recordedBy', 'nameLast nameFirst _id')
            .sort({ startDate: -1 })
            .lean();

        return {
            success: true,
            data: allergies
        };
    } catch (error) {
        if (error.statusCode) {
            throw error;
        }

        console.error('[Patient Allergy GET API Error]', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
            message: 'Failed to fetch patient allergies'
        });
    }
});
