import Patient from '../../models/patient.model'

export default defineEventHandler(async (event) => {
    try {

        const id = getRouterParam(event, 'id').toString().padStart(5, '0');

        // Validate patient ID
        if (!id || typeof id !== 'string') {
            throw createError({
                status: 400,
                statusMessage: 'Invalid Patient ID',
                message: 'Patient ID is required and must be a string'
            })
        }

        // Get orca data for insurances and make sure patient matches
        const orcaResponse = await getPatientInfo(id)
        if (!orcaResponse.success) {
            throw createError({
                status: 404,
                statusMessage: 'Patient Not Found',
                message: orcaResponse.message
            })
        }

        // Create insurance set array for patient

        let insuranceSets = orcaResponse.patientInfo.HealthInsurance_Information.HealthInsurance_Information_child

        if (!Array.isArray(insuranceSets)) {
            insuranceSets = [insuranceSets]
        }

        // Get DB patient data and attach insurance sets to it
        let patient = await Patient.findOne({ id })

        // Convert to plain object to ensure properties are included in response
        patient = patient.toObject ? patient.toObject() : patient
        patient.insuranceSets = insuranceSets

        return {
            success: true,
            data: patient
        }
    } catch (error) {
        if (error.statusCode) {
            throw error
        }

        console.error('[Patient Get API Error]', {
            id: getRouterParam(event, 'id'),
            error: error.message,
            stack: error.stack
        })

        throw createError({
            status: 500,
            statusMessage: 'Internal Server Error',
            message: 'Failed to fetch patient data'
        })
    }
})