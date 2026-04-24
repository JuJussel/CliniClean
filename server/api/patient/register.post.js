import Patient from '../../models/patient.model'
import { registerPatient } from '../../utils/orcaApiConnector'

export default defineEventHandler(async (event) => {

    try {
        const body = await readBody(event)

        // Register patient in Orca first
        const orcaResponse = await registerPatient(body)
        if(!orcaResponse.success) {
            throw new Error(orcaResponse.message)
        }

        // Extract Orca patient ID from response (adjust field names based on actual Orca API response)
        const orcaPatientId = orcaResponse.patientInfo.Patient_ID

        if (!orcaPatientId) {
            throw new Error('Failed to create patient in Orca')
        }

        // Create local database record
        const patient = new Patient({
            ...body,
            id: orcaPatientId
        })
        await patient.save()

        return {
            success: true,
            patient,
            id: orcaPatientId
        }

    } catch (error) {
        console.error('Error registering patient:', error)
        throw createError(400, error.message)
    }

})