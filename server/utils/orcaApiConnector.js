import xml2js from 'xml2js';
import { toFullwidth, toKatakana } from 'japanese-string-utils';

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
    const xmlOptions = {
        ignoreAttrs: true,
        explicitArray: false,
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
        var responseData = await response.text();
        responseData = await xml2js.parseStringPromise(responseData, xmlOptions);
        return responseData.xmlio2
    } catch (error) {
        console.error('Error calling Orca API:', error);
        throw error;
    }
}

/**
 * Build full-width WholeName from family and given names
 * @param {object} name - Name object with family and given properties
 * @returns {string} Combined name in full-width
 */
function buildWholeName(name) {
    if (!name) return '';
    const family = name.family || '';
    const given = name.given || '';
    const combined = `${family}　${given}`.trim();
    return toFullwidth(combined);
}

/**
 * Build full-width kana name from family and given kana names
 * @param {object} name - Name object with familyKana and givenKana properties
 * @returns {string} Combined kana name in full-width
 */
function buildWholeNameKana(name) {
    if (!name) return '';
    const familyKana = name.familyKana || '';
    const givenKana = name.givenKana || '';
    const combined = `${familyKana}　${givenKana}`.trim();
    return toFullwidth(toKatakana(combined));
}

/**
 * Format birthDate to Orca format (YYYY-MM-DD)
 * @param {Date|string} birthDate - Birth date as Date object or string
 * @returns {string} Formatted date string YYYY-MM-DD
 */
function formatBirthDate(birthDate) {
    if (!birthDate) return '';
    const date = new Date(birthDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Validate if apir result includes valid return codes 00, K1-K5
 * @param {object} apiResult - The Api_Result object from Orca response
 * @returns {boolean} True if valid, false otherwise
 */
function isValidApiResult(apiResult, codes, path=null) { 
    
    const status = apiResult[path].Api_Result;
    return codes.includes(status);

}


/** API functions **/

/**
 * Get patient information from Orca by patient ID
 * @param {string} patientId - The Orca patient ID
 * @returns {Promise<object>} Patient information object
 */
export async function getPatientInfo(patientId) {
    try {
        const endpoint = `/api01rv2/patientgetv2?id=${patientId}`;

        const response = await callOrcaApi(endpoint, 'GET');

        // Validate response structure
        if(!isValidApiResult(response, ['00'], 'patientinfores')) {
            const errorMsg = response.patientinfores.Api_Result_Message || 'Unknown error during patient registration';
            return { success: false, message: errorMsg }
        }
        return { success: true, patientInfo: response.patientinfores.Patient_Information };
    } catch (error) {
        return { success: false, message: error }
    }
}

/**
 * Register a new patient in Orca
 * Maps patient data from local schema to Orca API XML structure
 * @param {object} patientData - Patient data object with: birthDate, name, telecom, address
 * @returns {Promise<object>} Response from Orca API
 */
export async function registerPatient(patientData) {
    try {
        // Transform patient data to Orca API format
        const orcaPatientData = {
            data: {
                patientmodreq: {
                    $: { type: 'record' },
                    Patient_ID: { $: { type: 'string' }, _: "*"  }, // Auto-generate patient ID
                    WholeName: { $: { type: 'string' }, _: buildWholeName(patientData.name) },
                    WholeName_inKana: { $: { type: 'string' }, _: buildWholeNameKana(patientData.name) },
                    BirthDate: { $: { type: 'string' }, _: formatBirthDate(patientData.birthDate) },
                    Sex: { $: { type: 'string' }, _: patientData.gender === 'male' ? '1' : '2' },
                    CellularNumber: { $: { type: 'string' }, _: patientData.telecom?.phoneMobile || '' },
                    EmailAddress: { $: { type: 'string' }, _: patientData.telecom?.email || '' },
                    Home_Address_Information: {
                        $: { type: 'record' },
                        Address_ZipCode: { $: { type: 'string' }, _: patientData.address?.zip || '' },
                        WholeAddress1: { $: { type: 'string' }, _: patientData.address?.address || '' },
                        WholeAddress2: { $: { type: 'string' }, _: patientData.address?.line || '' },
                        PhoneNumber1: { $: { type: 'string' }, _: patientData.telecom?.phoneHome || '' }
                    },
                    HealthInsurance_Information: {
                        $: { type: "record" },
                        InsuranceProvider_Class: { $: { type: "string" }, _: "980" },
                    },

                }
            }
        };

        const endpoint = '/orca12/patientmodv2?class=01';
        const response = await callOrcaApi(endpoint, 'POST', orcaPatientData);
        if(!isValidApiResult(response, ['00', 'K1', 'K2', 'K3', 'K4', 'K5'], 'patientmodres')) {
            const errorMsg = response.patientmodres.Api_Warning_Message1 || 'Unknown error during patient registration';
            return { success: false, message: errorMsg }
        }
        
        return { success: true, patientInfo: response.patientmodres.Patient_Information };
    } catch (error) {
        console.error('Error registering patient:', error);
        return { success: false, message: error }
    }
}



