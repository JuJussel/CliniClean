import Patient from '../../models/patient.model'
import { registerPatient } from '../../utils/orcaApiConnector'


export default defineEventHandler(async (event) => {

    await requireUserSession(event)

    try {
        const id = getRouterParam(event, 'id')
        const orcaResponse = await getPatientInfo(id)
        return {orcaResponse}

        // const patient = await Patient.findOne({ id }).lean()
        // console.log(patient);

        // if (!patient) {
        //     throw createError({
        //         status: 404,
        //         message: 'Patient not found',
        //     })
        // }

        // return { patient }
    } catch (e) {
        console.log(e);

        throw createError({
            status: 500,
            message: 'Failed to fetch patient data',
        })
    }
})