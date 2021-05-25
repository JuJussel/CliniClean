const orcaConfig = require("../../config/orca.config");
const xml2js = require("xml2js")
const axios = require('axios');

const get = {}

const sendRequest = function(route, method, data = null) {

    if (data) {
        var builder = new xml2js.Builder()
        data = builder.buildObject(data)        
    }

    const config = {
        headers: {
            'Content-Type': 'text/xml'
        },
        auth: {
            username: orcaConfig.user,
            password: orcaConfig.pass
        },
        timeout: 10000
    }
    const xmlOptions = {
        ignoreAttrs: true,
        explicitArray: false
    }

    route = orcaConfig.url + route

    if(method === 'GET') {
        return new Promise(function(resolve, reject) {
            axios.get(route, config)
            .then(response => {
                xml2js.parseString(response.data, xmlOptions, function (err, result) {
                    resolve(result.xmlio2)
                });            
            })
            .catch(err => {
                $logger.error(err)
                reject(err.code + ' - ORCA API connection ' + err.message)
            })
        })
    } else {
        return new Promise(function(resolve, reject) {
            axios.post(route, data, config)
            .then(response => {
                xml2js.parseString(response.data, xmlOptions, function (err, result) {
                    resolve(result.xmlio2)
                });            
            })
            .catch(err => {
                $logger.error(err)
                reject(err.code + ' - ORCA API connection ' + err.message)
            })
        })
    }
}

const validate = function(data, acceptedCodes, key) {

    const status = data[key].Api_Result
    if (acceptedCodes.includes(status)) {
        return true
    } else {
        $logger.error(data[key].Api_Result_Message)
        return false
    }

}

////////////////////////////////////////////////////////////////////////////
//////////////////////// Get Patient Info //////////////////////////////////
////////////////////////////////////////////////////////////////////////////
get.patient = function(data, result) {

    const requestData = {
        patientlst2req: {
            Patient_ID_Information: [
                {Patient_ID: data}
            ]
        }
    }
    // const responseData = sendRequest('', 'GET', requestData)
    result(null, {ok: true})
    return
}

////////////////////////////////////////////////////////////////////////////
///////////////////// Get Patient Full Insucance Details ///////////////////
////////////////////////////////////////////////////////////////////////////
get.insurances = function(data, result) {

    const requestData = {
        data: {
            patientlst2req: {
                $: { type: 'record' },
                Patient_ID_Information: {
                    $: { type: "array" },
                    Patient_ID_Information_child : {
                        $: { type: "record" },
                        Patient_ID:  {
                            $: { type: "string" }, 
                            _: data
                        }         
                    }
                }
            }
        }
    }
    const route = '/api01rv2/patientlst2v2?class=01'
    sendRequest(route, 'POST', requestData)
    .then(responseData => {
        if (validate(responseData, ['00'], 'patientlst2res')) {
            responseData = 
                responseData.patientlst2res.Patient_Information
                .Patient_Information_child.HealthInsurance_Information
                .HealthInsurance_Information_child
            result(null, responseData)
        } else {
            result(responseData.patientlst2res.Api_Result_Message, null)
        }
        return
    })
    .catch(responseData => {
        result(responseData, null)
        return
    })
}

////////////////////////////////////////////////////////////////////////////
//////////////////////// Get Patient Insucance Sets ////////////////////////
////////////////////////////////////////////////////////////////////////////
get.insuranceSets = function(data, result) {

    const route = '/api01rv2/patientgetv2?id=' + data
    sendRequest(route, 'GET')
    .then(responseData => {
        if (validate(responseData, ['00'], 'patientinfores')) {
            responseData = 
                responseData.patientinfores.Patient_Information
                .HealthInsurance_Information.HealthInsurance_Information_child
            result(null, responseData)
        } else {
            result(responseData.patientlst2res.Api_Result_Message, null)
        }
        return
    })
    .catch(responseData => {
        result(responseData, null)
        return
    })

}


module.exports.get = get