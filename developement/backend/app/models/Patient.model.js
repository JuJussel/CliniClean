const mongoose = require('./db.mongo')
const Schema = mongoose.Schema;

/**
 * MongoDB Collection Schema for a Hospital Patient Resource.
 * Based on selected fields from FHIR JP Core Patient resource.
 */
const PatientSchema = new Schema({
    // --- Core Patient Identification and Status (FHIR Standard) ---

    // Native MongoDB ID
    _id: { type: 'ObjectId', description: 'MongoDB primary key.' },

    // FHIR Resource ID (often matches the string version of _id)
    id: { type: 'string', required: true, description: 'The logical FHIR ID for the resource.' },

    // Patient Status
    active: { type: 'boolean', default: true, description: 'Whether the patient record is currently active.' },

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
        type: 'array',
        description: 'Patient names, including Kanji (official) and Kana (phonetic) readings.',
        items: {
            type: 'object',
            properties: {
                use: {
                    type: 'string',
                    enum: ['usual', 'official', 'temp', 'nickname', 'anonymous', 'old', 'maiden'],
                    description: 'Distinguishes between official (Kanji) and phonetic (Kana) names.'
                },
                nameRepresentationUse: {
                    type: 'string',
                    description: 'A set of codes for each different representation of a name. ABC = Romaji, IDE = Kanji, SYL = Kana',
                    enum: ['ABC', 'IDE', 'SYL']
                },
                family: { type: 'string', description: 'Last name (Kanji or Kana, based on use).' },
                given: { type: 'array', items: { type: 'string' }, description: 'First and additional names (Kanji or Kana, based on use).' },
            }
        }
    },

    // --- Contact Information (Phone and Mail) ---
    // Maps to FHIR telecom array (ContactPoint)
    telecom: {
        type: 'array',
        description: 'Contact details, including phone (system: phone) and mail (system: email).',
        items: {
            type: 'object',
            properties: {
                system: { type: 'string', enum: ['phone', 'email'], required: true },
                value: { type: 'string', required: true, description: 'The phone number or email address.' },
                use: { type: 'string', enum: ['home', 'work', 'mobile'] }
            }
        }
    },

    // --- Address (FHIR Address) ---
    address: {
        type: 'array',
        description: 'Patient residential and/or work addresses.',
        items: {
            type: 'object',
            properties: {
                use: { type: 'string', enum: ['home', 'work'] },
                type: { type: 'string', enum: ['postal', 'physical'] },
                line: { type: 'array', items: { type: 'string' }, description: 'Street address lines.' },
                city: { type: 'string' },
                district: { type: 'string', description: 'Prefecture/State/Province.' },
                country: { type: 'string', default: 'JPN' },
                postalCode: { type: 'string', description: 'Zip code' }
            }
        }
    },

    // --- Custom and Extended Fields ---

    // Custom field for record creation date
    createdDate: { type: 'date', default: 'Date.now', description: 'Record creation timestamp.' },

    // Custom field for occupation (often an extension in FHIR)
    occupation: { type: 'string', description: 'The primary occupation of the patient.' },

    // Custom field for Employer/Company Info
    companyInfo: {
        type: 'object',
        description: 'Information about the patients current employer.',
        properties: {
            name: { type: 'string' },
            phone: { type: 'string' },
            address: { type: 'string' }
        }
    },
    // --- Contact (FHIR Patient.contact / JP Core) ---
    contact: {
        type: 'array',
        description: 'A contact party (e.g., guardian, partner, friend) for the patient.',
        items: {
            type: 'object',
            properties: {
                relationship: {
                    type: 'array',
                    description: 'The nature of the relationship (e.g., guardian, next-of-kin).',
                    items: { type: 'string' }
                },
                name: {
                    type: 'object',
                    properties: {
                        use: { type: 'string' },
                        family: { type: 'string' },
                        given: { type: 'array', items: { type: 'string' } },
                        text: { type: 'string' }
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
                address: {
                    type: 'object',
                    properties: {
                        line: { type: 'array', items: { type: 'string' } },
                        city: { type: 'string' },
                        district: { type: 'string' },
                        country: { type: 'string' }
                    }
                },
                // custom extension to indicate type information about the contact
                type: {
                    type: 'object',
                    description: 'Extension object for contact types (JP Core addition)',
                    properties: {
                        householder: { type: 'boolean', description: 'Whether this contact is the householder' }
                    }
                },
                gender: { type: 'string', enum: ['male', 'female', 'other', 'unknown'] },
                organization: { type: 'object', description: 'Organization acting as a contact organization', properties: { reference: { type: 'string' }, display: { type: 'string' } } },
                period: { type: 'object', properties: { start: { type: 'date' }, end: { type: 'date' } } }
            }
        }
    }

});

module.exports = mongoose.model("patients", PatientSchema);