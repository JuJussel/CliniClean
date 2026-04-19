import xml2js from 'xml2js';

const orcaUrl = process.env.ORCA_URL;
const orcaUser = process.env.ORCA_USER;
const orcaPass = process.env.ORCA_PASS;

/**
 * Base function to call Orca API
 * @param {string} endpoint - The API endpoint (e.g., '/api01rv2/patientgetv2?id=123')
 * @param {string} method - HTTP method (GET, POST, etc.)
 * @param {object} data - Request body data (optional)
 * @returns {Promise<object>} Parsed XML response as JSON
 */
export async function callOrcaApi(endpoint, method = 'GET', data = null) {
    const url = `${orcaUrl}${endpoint}`;
    const options = {
        method,
        headers: {
            'Content-Type': 'text/xml',
            'Authorization': 'Basic ' + Buffer.from(`${orcaUser}:${orcaPass}`).toString('base64')
        }
    };

    if (data) {
        const builder = new xml2js.Builder();
        options.body = builder.buildObject(data);
    }

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`Orca API error: ${response.statusText} (${response.status})`);
        }
        const responseData = await response.text();
        return await xml2js.parseStringPromise(responseData);
    } catch (error) {
        console.error('Error calling Orca API:', error);
        throw error;
    }
}

/**
 * Get patient information from Orca by patient ID
 * @param {string} patientId - The Orca patient ID
 * @returns {Promise<object>} Patient information object
 */
export async function getPatientInfo(patientId) {
    try {
        const endpoint = `/api01rv2/patientgetv2?id=${patientId}`;
        const responseData = await callOrcaApi(endpoint, 'GET');

        // Validate response structure
        if (responseData.patientinfores?.[0]?.Api_Result == ['00']) {
            return responseData.patientinfores[0].Patient_Information[0];
        } else {
            const errorMsg = responseData?.patientinfores?.[0]?.Api_Result_Message?.[0] || 'Unknown error';
            throw new Error(`Orca API error: ${errorMsg}`);
        }
    } catch (error) {
        console.error('Error getting patient info:', error);
        throw error;
    }
}

/**
 * Register a new patient in Orca
 * @param {object} patientData - Patient data object
 * @returns {Promise<object>} Response from Orca API
 */
export async function registerPatient(patientData) {
    try {
        const endpoint = '/api01rv2/patientset';
        const response = await callOrcaApi(endpoint, 'POST', patientData);
        return response;
    } catch (error) {
        console.error('Error registering patient:', error);
        throw error;
    }
}
