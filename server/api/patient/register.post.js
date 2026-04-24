import Patient from '../../models/patient.model'
import { registerPatient } from '../../utils/orcaApiConnector'

export default defineEventHandler(async (event) => {
    try {

        const body = await readBody(event)

        // Validate required fields
        if (!body.name?.family || !body.name?.given) {
            throw createError({
                status: 400,
                statusMessage: 'Invalid Patient Data',
                message: 'Patient name (family and given) is required'
            })
        }

        // Register patient in Orca first
        const orcaResponse = await registerPatient(body)
        if (!orcaResponse.success) {
            throw createError({
                status: 400,
                statusMessage: 'Orca Registration Failed',
                message: orcaResponse.message
            })
        }

        // Extract Orca patient ID from response
        const orcaPatientId = orcaResponse.patientInfo?.Patient_ID

        if (!orcaPatientId) {
            throw createError({
                status: 400,
                statusMessage: 'Invalid Orca Response',
                message: 'Failed to retrieve patient ID from Orca'
            })
        }

        // Create local database record
        const patient = new Patient({
            ...body,
            id: orcaPatientId
        })
        await patient.save()

        return {
            success: true,
            data: {
                patient,
                id: orcaPatientId
            }
        }
    } catch (error) {
        if (error.statusCode) {
            throw error
        }

        console.error('[Patient Register API Error]', {
            error: error.message,
            stack: error.stack
        })

        throw createError({
            status: 500,
            statusMessage: 'Internal Server Error',
            message: 'Failed to register patient'
        })
    }
})