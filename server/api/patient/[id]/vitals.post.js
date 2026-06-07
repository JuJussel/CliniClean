import Patient from '../../../models/patient.model'
import Vital from '../../../models/vital.model'

export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, 'id').toString().padStart(5, '0');
        const body = await readBody(event);

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

        // Calculate BMI automatically if weight (kg) and height (cm) are provided and BMI isn't explicitly sent
        let bmiVal = body.bmi;
        if (body.weight && body.height && !bmiVal) {
            const heightInMeters = body.height / 100;
            bmiVal = Math.round((body.weight / (heightInMeters * heightInMeters)) * 10) / 10;
        }

        // Create new vital entry
        const vitalEntry = new Vital({
            patient: patientDoc._id,
            encounter: body.encounter || null,
            date: body.date ? new Date(body.date) : new Date(),
            recordedBy: event.context.auth?.user?._id || null, // if session auth is present
            
            bloodPreasureHigh: body.bloodPreasureHigh || null,
            bloodPreasureLow: body.bloodPreasureLow || null,
            pulse: body.pulse || null,
            temperature: body.temperature || null,
            spo2: body.spo2 || null,
            weight: body.weight || null,
            bmi: bmiVal || null,
            waist: body.waist || null,
            height: body.height || null,
            head: body.head || null,
            breast: body.breast || null,
            memo: body.memo || ""
        });

        await vitalEntry.save();

        return {
            success: true,
            data: vitalEntry
        };
    } catch (error) {
        if (error.statusCode) {
            throw error;
        }

        console.error('[Patient Vitals POST API Error]', error);
        throw createError({
            status: 500,
            statusMessage: 'Internal Server Error',
            message: 'Failed to record vitals'
        });
    }
})
