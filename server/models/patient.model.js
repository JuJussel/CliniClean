import { defineMongooseModel } from '#nuxt/mongoose'

const Patient = defineMongooseModel({
    name: 'Patient',
    schema: {
        id: { type: 'string', default: null, description: 'ID matching Orca patient ID.' },
        type: {
            type: 'string', enum: ['patient', 'guardian', 'emergency_contact', 'contact', 'other'],
            default: 'contact'
        },
        status: { type: 'string', enum: ['active', 'inactive', 'pending'], default: 'active' },
        birthDate: { type: 'date' },
        gender: {
            type: 'string',
            enum: ['male', 'female', 'other', 'unknown'],
        },
        name: {
            type: 'object',
            properties: {
                family: { type: 'string' },
                given: { type: 'string' },
                familyKana: { type: 'string' },
                givenKana: { type: 'string' },

            }
        },
        nameOther: {
            type: 'array',
            description: 'Other names for the Patient, such as maiden names or nicknames.',
            items: {
                type: 'object',
                properties: {
                    family: { type: 'string' },
                    given: { type: 'string' },
                }
            }
        },
        telecom: {
            type: 'object',
            properties: {
                email: { type: 'string' },
                phoneMobile: { type: 'string' },
                phoneHome: { type: 'string' },
                phoneWork: { type: 'string' },
            }
        },
        createdDate: {
            type: 'date', default: Date.now(),
        },
        address: {
            type: 'object',
            properties: {
                line: { type: 'string' },
                address: { type: 'string' },
                zip: { type: 'string' },
                country: { type: 'string' }
            }
        },
        occupation: { type: 'string' },
        contact: {
            person: {
                type: 'object',
                properties: {
                    name: {
                        type: 'object',
                        properties: {
                            family: { type: 'string' },
                            given: { type: 'string' },
                            familyKana: { type: 'string' },
                            givenKana: { type: 'string' },

                        }
                    },
                    telecom: {
                        type: 'object',
                        properties: {
                            email: { type: 'string' },
                            phoneMobile: { type: 'string' },
                            phoneHome: { type: 'string' },
                            phoneWork: { type: 'string' },
                        }
                    },
                }
            },
            relationship: {
                type: 'string',
                description: 'The nature of the relationship (e.g., guardian, next-of-kin).'
            },
        },
        insurances: {
            type: 'array',
        }
    },
    options: {
        collection: 'patients',
    }

})

export default Patient