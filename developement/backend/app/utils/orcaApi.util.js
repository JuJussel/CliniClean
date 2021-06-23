const japUtils = require("japanese-string-utils");
const orcaConfig = require("../../config/orca.config");
const xml2js = require("xml2js");
const axios = require("axios");

const get = {};
const post = {};

const sendRequest = function (route, method, data = null) {
  if (data) {
    var builder = new xml2js.Builder();
    data = builder.buildObject(data);
  }

  const config = {
    headers: {
      "Content-Type": "text/xml",
    },
    auth: {
      username: orcaConfig.user,
      password: orcaConfig.pass,
    },
    timeout: 10000,
  };
  const xmlOptions = {
    ignoreAttrs: true,
    explicitArray: false,
  };

  route = orcaConfig.url + route;

  if (method === "GET") {
    return new Promise(function (resolve, reject) {
      axios
        .get(route, config)
        .then((response) => {
          xml2js.parseString(response.data, xmlOptions, function (err, result) {
            resolve(result.xmlio2);
          });
        })
        .catch((err) => {
          $logger.error(err);
          reject(err.code + " - ORCA API connection " + err.message);
        });
    });
  } else {
    return new Promise(function (resolve, reject) {
      axios
        .post(route, data, config)
        .then((response) => {
          xml2js.parseString(response.data, xmlOptions, function (err, result) {
            resolve(result.xmlio2);
          });
        })
        .catch((err) => {
          $logger.error(err);
          reject(err.code + " - ORCA API connection " + err.message);
        });
    });
  }
};

const validate = function (data, acceptedCodes, key) {
  const status = data[key].Api_Result;
  if (acceptedCodes.includes(status)) {
    return true;
  } else {
    $logger.error(data[key].Api_Result_Message);
    return false;
  }
};

////////////////////////////////////////////////////////////////////////////
//////////////////////// Get Patient Info //////////////////////////////////
////////////////////////////////////////////////////////////////////////////
get.patient = function (data, result) {
    route = '/api01rv2/patientgetv2?id=' + data;
    sendRequest(route, "GET")
    .then((responseData) => {
      if (validate(responseData, ["00"], "patientinfores")) {
        responseData = responseData.patientinfores.Patient_Information;
        result(null, responseData);
      } else {
        result(responseData.patientinfores.Api_Result_Message, null);
      }
      return;
    })
    .catch((responseData) => {
      result(responseData, null);
      return;
    });
};

////////////////////////////////////////////////////////////////////////////
///////////////////// Get Patient Full Insucance Details ///////////////////
////////////////////////////////////////////////////////////////////////////
get.insurances = function (data, result) {
  const requestData = {
    data: {
      patientlst2req: {
        $: { type: "record" },
        Patient_ID_Information: {
          $: { type: "array" },
          Patient_ID_Information_child: {
            $: { type: "record" },
            Patient_ID: {
              $: { type: "string" },
              _: data,
            },
          },
        },
      },
    },
  };
  const route = "/api01rv2/patientlst2v2?class=01";
  sendRequest(route, "POST", requestData)
    .then((responseData) => {
      if (validate(responseData, ["00"], "patientlst2res")) {
        responseData =
          responseData.patientlst2res.Patient_Information
            .Patient_Information_child.HealthInsurance_Information
            .HealthInsurance_Information_child;
        result(null, responseData);
      } else {
        result(responseData.patientlst2res.Api_Result_Message, null);
      }
      return;
    })
    .catch((responseData) => {
      result(responseData, null);
      return;
    });
};

////////////////////////////////////////////////////////////////////////////
//////////////////////// Get Patient Insucance Sets ////////////////////////
////////////////////////////////////////////////////////////////////////////
get.insuranceSets = function (data, result) {
  const route = "/api01rv2/patientgetv2?id=" + data;
  sendRequest(route, "GET")
    .then((responseData) => {
      if (validate(responseData, ["00"], "patientinfores")) {
        responseData =
          responseData.patientinfores.Patient_Information
            .HealthInsurance_Information.HealthInsurance_Information_child;
        result(null, responseData);
      } else {
        result(responseData.patientlst2res.Api_Result_Message, null);
      }
      return;
    })
    .catch((responseData) => {
      result(responseData, null);
      return;
    });
};

////////////////////////////////////////////////////////////////////////////
//////////////////////// Get  Insucance Provider ///////////////////////////
////////////////////////////////////////////////////////////////////////////
get.insuranceProvider = function (data, result) {

    const requestData = {
        data: {
            insprogetreq: {
                $: { type: "record" },
                InsuranceProvider_Number: { $: { type: "string" }, _: data },
                Insurance_Number: { $: { type: "string" } },
            }
        }
    };

    const route = "/api01rv2/insprogetv2";

    sendRequest(route, "POST", requestData)
      .then((responseData) => {
        if (validate(responseData, ["00"], "insprogetres")) {
          responseData = responseData.insprogetres.TInsuranceProvider_Information.TInsuranceProvider_Information_child;
          result(null, responseData);
        } else {
          result(responseData.insprogetres.Api_Result_Message, null);
        }
        return;
      })
      .catch((responseData) => {
        result(responseData, null);
        return;
      });
  };
  
////////////////////////////////////////////////////////////////////////////
////////////////////////////// Create Patient //////////////////////////////
////////////////////////////////////////////////////////////////////////////
post.patient = async function (data, result) {
    data.name = japUtils.toFullwidth(data.name);
    data.nameKana = japUtils.toFullwidth(data.nameKana);
    data.householderName = japUtils.toFullwidth(data.householderName);

    const requestData = {
        data: {
            patientmodreq: {
                $: { type: "record" },
                Patient_ID: { $: { type: "string" }, _: "*" },
                WholeName: { $: { type: "string" }, _: data.name },
                WholeName_inKana: { $: { type: "string" }, _: data.nameKana },
                BirthDate: { $: { type: "string" }, _: data.birthdate },
                Sex: { $: { type: "string" }, _: data.gender },
                HouseHolder_WholeName: {
                    $: { type: "string" },
                    _: data.householderName,
                },
                Relationship: { $: { type: "string" }, _: data.relation },
                Occupation: { $: { type: "string" }, _: data.occupation },
                CellularNumber: { $: { type: "string" }, _: data.phone },
                EmailAddress: { $: { type: "string" }, _: data.mail },
                Home_Address_Information: {
                    $: { type: "record" },
                    Address_ZipCode: { $: { type: "string" }, _: data.address.zip },
                    WholeAddress1: { $: { type: "string" }, _: data.address.addr },
                    WholeAddress2: { $: { type: "string" }, _: "" },
                    PhoneNumber1: { $: { type: "string" }, _: "" },
                },
                WorkPlace_Information: {
                    $: { type: "record" },
                    WholeName: { $: { type: "string" }, _: data.company.name },
                    Address_ZipCode: { $: { type: "string" }, _: data.company.zip },
                    WholeAddress1: { $: { type: "string" }, _: data.company.addr },
                    WholeAddress2: { $: { type: "string" }, _: "" },
                    PhoneNumber: { $: { type: "string" }, _: data.company.phone },
                },
                HealthInsurance_Information: {
                    $: { type: "record" },
                    InsuranceProvider_Class: { $: { type: "string" }, _: "980" },
                },
            },
        },
    };

    const route = "/orca12/patientmodv2?class=01";
    const responseData = await sendRequest(route, "POST", requestData)
        .catch((responseData) => {
            result(responseData, null);
            return;
        });
    if (!validate(responseData,["00", "K1", "K2", "K3", "K4", "K5"],"patientmodres")) {
        result(responseData.patientlst2res.Api_Result_Message, null);
        return;
    }

    let patientId = responseData.patientmodres.Patient_Information.Patient_ID;
    let insurances = data.insurance.filter((item) => item.type === "ins");
    let publicInsurance = data.insurance.filter(
        (item) => item.type === "pub"
    );

    for (let i = 0; i < insurances.length; i++) {
        const ins = insurances[i];

        ins.insuredName = japUtils.toFullwidth(ins.insuredName);
        
        const insReqData = {
            data: {
                patientmodreq: {
                    $: { type: "record" },
                    Mod_Key: { $: { type: "string" }, _: "2" },
                    Patient_ID: { $: { type: "string" }, _: patientId },
                    WholeName: { $: { type: "string" }, _: data.name },
                    WholeName_inKana: { $: { type: "string" }, _: data.nameKana },
                    BirthDate: { $: { type: "string" }, _: data.birthdate },
                    Sex: { $: { type: "string" }, _: data.gender },
                    HealthInsurance_Information: {
                        $: { type: "record" },
                        InsuranceProvider_Class: { $: { type: "string" }, _: "" },
                        InsuranceProvider_Number: { $: { type: "string" }, _: ins.providerNumber},
                        InsuranceProvider_WholeName: { $: { type: "string" }, _: "" }, 
                        HealthInsuredPerson_Symbol: { $: { type: "string" }, _: ins.symbol },
                        HealthInsuredPerson_Number: { $: { type: "string" }, _: ins.number },
                        RelationToInsuredPerson: { $: { type: "string" }, _: ins.relation },
                        HealthInsuredPerson_WholeName: { $: { type: "string" }, _: ins.insuredName },
                        Certificate_StartDate: { $: { type: "string" }, _: ins.getDate },
                        Certificate_ExpiredDate: { $: { type: "string" }, _: ins.validDate[1] },
                        Certificate_GetDate: { $: { type: "string" }, _: ins.validDate[0] },
                        PublicInsurance_Information: { $: { type: "array" } }
                    }
                }
            }
        };
        const route = "/orca12/patientmodv2?class=04";
        const insResData = await sendRequest(route, "POST", insReqData)
            .catch((responseData) => {
                result(responseData, null);
                return;
            });
        if (!validate(insResData,["00"],"patientmodres")) {
            result(insResData.patientmodres.Api_Result_Message, null);
            return;
        }
    }

    if (publicInsurance.length > 0) {

        const pubInsReqData = {
            data: {
                patientmodreq: {
                  $: { type: "record" },
                  Mod_Key: { $: { type: "string" }, _: "2" },
                  Patient_ID: { $: { type: "string" }, _: patientId },
                  WholeName: { $: { type: "string" }, _: data.name },
                  WholeName_inKana: { $: { type: "string" }, _: data.nameKana },
                  BirthDate: { $: { type: "string" }, _: data.birthdate },
                  Sex: { $: { type: "string" }, _: data.gender },
                  HealthInsurance_Information: {
                    $: { type: "record" },
                    PublicInsurance_Information: {
                      $: { type: "array" },
                      PublicInsurance_Information_child: []
                    }
                  }
                }
            }
        };

        publicInsurance.forEach((pub) => {
          let pubInstance = {
            $: { type: "record" },
            PublicInsurance_Class: { $: { type: "string" }, _: "" },
            PublicInsurer_Number: { $: { type: "string" }, _: pub.provider },
            PublicInsuredPerson_Number: {
            $: { type: "string" },
            _: pub.recepient,
            },
            Certificate_IssuedDate: {
            $: { type: "string" },
            _: pub.validDate[0],
            },
            Certificate_ExpiredDate: {
            $: { type: "string" },
            _: pub.validDate[1],
            },
          };
          pubInsReqData.data.patientmodreq.HealthInsurance_Information.PublicInsurance_Information.PublicInsurance_Information_child.push(pubInstance);
        });

        const route = "/orca12/patientmodv2?class=04";

        const pubResData = await sendRequest(route, "POST", pubInsReqData)
            .catch((responseData) => {
                result(responseData, null);
                return;
            });
    
        if (!validate(pubResData,["00"],"patientmodres")) {
            result(pubResData.patientmodres.Api_Result_Message, null);
            return;
        }
    }

    result(null, patientId);
    return;

};

module.exports.get = get;
module.exports.post = post;
