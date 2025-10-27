const mongoose = require('./db.mongo')
const Schema = mongoose.Schema;

/**
 * MongoDB Collection Schema for a Hospital Patient Resource.
 * Based on selected fields from FHIR JP Core Patient resource.
 */
const PersonSchema = new Schema({
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
    // Custom field for record creation date
    createdDate: { type: 'date', default: Date.now(), description: 'Record creation timestamp.' },

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

})