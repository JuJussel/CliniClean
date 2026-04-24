import Patient from '../../models/patient.model'
import { registerPatient } from '../../utils/orcaApiConnector'


export default defineEventHandler(async (event) => {
    try {

        const id = getRouterParam(event, 'id')

        // Validate patient ID
        if (!id || typeof id !== 'string') {
            throw createError({
                status: 400,
                statusMessage: 'Invalid Patient ID',
                message: 'Patient ID is required and must be a string'
            })
        }

        const orcaResponse = await getPatientInfo(id)
        if (!orcaResponse.success) {
            throw createError({
                status: 404,
                statusMessage: 'Patient Not Found',
                message: orcaResponse.message
            })
        }

        return {
            success: true,
            data: orcaResponse.patientInfo
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