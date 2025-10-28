const mongoose = require('./db.mongo')
const Schema = mongoose.Schema;

/**
 * MongoDB Collection Schema for a Hospital Patient Resource.
 * Based on selected fields from FHIR JP Core Patient resource.
 */
const PersonSchema = new Schema({

    // ID returned from Orca. Used as main patient id in all correspondence
    id: { type: 'string', default: null, description: 'ID matching Orca patient ID.' },

    //Type of the cperson
    type: {
        type: 'string', enum: ['patient', 'guardian', 'emergency_contact', 'contact' 'other'],
        description: 'The type of person (e.g., patient, guardian, emergency contact).',
        default: 'contact'
    },

    // Person Status
    active: { type: 'boolean', default: true, description: 'Whether the person record is currently active.' },

    // Date of Birth
    birthDate: { type: 'date', description: 'The date of birth for the individual.' },

    // Gender
    gender: {
        type: 'string',
        enum: ['male', 'female', 'other', 'unknown'],
        description: 'The gender of the patient.'
    },

    // --- Name Information (Kanji and Kana) ---
    // Uses an array of HumanName objects to store both official (Kanji) and phonetic (Kana) names,
    // following common Japanese FHIR implementation patterns.

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
        description: 'Other names for the person, such as maiden names or nicknames.',
        items: {
            type: 'object',
            properties: {
                family: { type: 'string' },
                given: { type: 'string' },
            }
        }
    },

    telecom: {
        type: 'array',
        items: {
            type: 'object',
            properties: {
                system: { type: 'string', enum: ['phone', 'email'] },
                value: { type: 'string' },
                use: { type: 'string', enum: ['home', 'work', 'mobile'] }
            }
        }
    },
    // Custom field for record creation date
    createdDate: { type: 'date', default: Date.now(), description: 'Record creation timestamp.' },

    address: {
        type: 'object',
        properties: {
            line: { type: 'string' },
            address: { type: 'string' },
            zip: { type: 'string' },
            country: { type: 'string' }
        }
    },

    // Custom field for occupation (often an extension in FHIR)
    occupation: { type: 'string', description: 'The primary occupation of the patient.' },

    // --- Contact (FHIR Patient.contact / JP Core) ---

    contact: {
        person: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "persons",
        },
        relationship: {
            type: 'string',
            description: 'The nature of the relationship (e.g., guardian, next-of-kin).'
        },

    }

})

module.exports = mongoose.model("persons", PersonSchema);
