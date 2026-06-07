import Patient from '../../../models/patient.model'
import Vital from '../../../models/vital.model'

export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, 'id').toString().padStart(5, '0');

        // Validate patient ID
        if (!id || typeof id !== 'string') {
            throw createError({
                status: 400,
                statusMessage: 'Invalid Patient ID',
                message: 'Patient ID is required'
            });
        }

        // Find patient in DB first to get MongoDB ObjectId
        const patientDoc = await Patient.findOne({ id });
        if (!patientDoc) {
            throw createError({
                status: 404,
                statusMessage: 'Patient Not Found',
                message: `Patient with ID ${id} not found in database.`
            });
        }

        // Find vitals matching the patient's MongoDB ObjectId
        const vitals = await Vital.find({ patient: patientDoc._id })
            .populate('recordedBy', 'nameLast nameFirst _id')
            .sort({ date: -1 })
            .lean();

        return {
            success: true,
            data: vitals
        };
    } catch (error) {
        if (error.statusCode) {
            throw error;
        }

        console.error('[Patient Vitals GET API Error]', error);
        throw createError({
            status: 500,
            statusMessage: 'Internal Server Error',
            message: 'Failed to fetch patient vitals'
        });
    }
})
