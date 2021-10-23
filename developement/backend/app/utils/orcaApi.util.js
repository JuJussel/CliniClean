const japUtils = require("japanese-string-utils");
const orcaConfig = require("../../config").orca;
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
//////////////////////// Get Patient Diseases //////////////////////////////
////////////////////////////////////////////////////////////////////////////
get.diseases = function (data, result) {

  const requestData = {
    data: {
        disease_inforeq: {
            $: { type: "record" },
            Patient_ID: { $: { type: "string" }, _: data },
            Base_Date: { $: { type: "string" } },
        }
    }
  };

  const route = "/orca101/diseasegetv2?class=01";

  sendRequest(route, "POST", requestData)
    .then((responseData) => {
      if (validate(responseData, ['00', '21'], "disease_infores")) {
        responseData = responseData.disease_infores;
        if (responseData.Api_Result === '21') {
          responseData = [];
        } else {
          responseData = responseData.Disease_Information.Disease_Information_child;
          if (responseData.Department_Code) {
            responseData = [responseData];
          }
        }

        responseData = responseData.map(item => {

          item = {
            disease: {
              code: item.Disease_Single.Disease_Single_child.Disease_Single_Code,
              name: item.Disease_Single.Disease_Single_child.Disease_Single_Name
            },
            showOnRezept: item.Disease_Receipt_Print === "1" ? false : true,
            primaryDisease: item.Disease_Category === "PD" ? true : false,
            suspectOrAcuteFlag: item.Disease_SuspectedFlag,
            supplementNote: item.Disease_Supplement_Name,
            outcome: item.Disease_OutCome,
            endDate: item.Disease_EndDate || null,
            startDate:item.Disease_StartDate || null,
            insurance: item.Insurance_Combination_Number || "0001"
          }

          return item;
        })
        result(null, responseData);
      } else {
        result(responseData.disease_infores.Api_Result_Message, null);
      }
      return;
    })
    .catch((responseData) => {
      result(responseData, null);
      return;
    });
}

////////////////////////////////////////////////////////////////////////////
//////////////////////// Get Patient Payments //////////////////////////////
////////////////////////////////////////////////////////////////////////////
get.payments = function (data, result) {

  const requestData = {
    data: {
      private_objects: {
            $: { type: "record" },
            Patient_ID: { $: { type: "string" }, _: data.patientId },
            Perform_Date: { $: { type: "string" }, _: data.date },
        }
    }
  };

  const route = "/api01rv2/incomeinfv2";

  sendRequest(route, "POST", requestData)
    .then((responseData) => {

      if (validate(responseData, ['0000'], "private_objects")) {
        responseData = responseData.private_objects.Income_Information;
        responseData = responseData ? responseData.Income_Information_child : [];
        result(null, responseData);
      } else {
        result(responseData.private_objects.Api_Result_Message, null);
      }
      return;
    })
    .catch((responseData) => {
      result(responseData, null);
      return;
    });
}


////////////////////////////////////////////////////////////////////////////
////////////////////////////// Create/Edit Patient /////////////////////////
////////////////////////////////////////////////////////////////////////////
post.patient = async function (data, result) {
    data.name = japUtils.toFullwidth(data.name);
    data.nameKana = japUtils.toFullwidth(data.nameKana);
    data.householderName = japUtils.toFullwidth(data.householderName);

    const requestData = {
        data: {
            patientmodreq: {
                $: { type: "record" },
                Mod_Key: {$: { type: "string" }, _: data.editSexOrBirthdate ? "2" : "1"},
                Patient_ID: { $: { type: "string" }, _: data.edit ? data.id : "*" },
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

    const route = data.edit? "/orca12/patientmodv2?class=02" : "/orca12/patientmodv2?class=01";
    const responseData = await sendRequest(route, "POST", requestData)
        .catch((responseData) => {
            result(responseData, null);
            return;
        });
    if (!validate(responseData,["00", "K1", "K2", "K3", "K4", "K5"],"patientmodres")) {
        result(responseData.patientmodres.Api_Result_Message, null);
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

////////////////////////////////////////////////////////////////////////////
//////////////////////// Register Procedure/////////////////////////////////
//////////////// Includes Shohou, Kensa, Shot, Koui ////////////////////////
////////////////////////////////////////////////////////////////////////////
post.procedures = async function (data) {

  let insurance = data.ins;
  let procedures = data.baseCost ? data.baseCost.concat(data.karte.procedures) : data.karte.procedures;
  let patientId = data.patient.id;
  let orcaProcedures = {};
  let route = "/api21/medicalmodv2?class=01";


  // Loop procedures
  procedures.forEach(item => {

    // Base XML
    let orcaXml = {
        $: { type: "record" },
        Medical_Class: { $: { type: "string" }, _: item.cat.orcaCode },
        Medical_Class_Number: {
            $: { type: "string" },
            _: item.count ? item.count : "1",
        },
        Medication_info: { $: { type: "array" }, Medication_info_child: [] }
    };


    if (item.cat.code === 30) {

      item.procCode = "130000510";
      if (item.varData?.location === "静脈") {
        item.cat.orcaCode = "320";
        item.procCode = "130003510"
      };

      let itemXml = {
          $: { type: "record" },
          Medication_Code: { $: { type: "string" }, _: item.procCode },
          Medication_Name: { $: { type: "string" }, _: "" }
      };
      orcaXml.Medication_info.Medication_info_child.push(itemXml);
      
      itemXml = {
          $: { type: "record" },
          Medication_Code: { $: { type: "string" }, _: item.srycd },
          Medication_Name: { $: { type: "string" }, _: "" },
          Medication_Number: {
              $: { type: "string" },
              _: item.varData?.amount,
          },
      };
      orcaXml.Medication_info.Medication_info_child.push(itemXml);

    } else if (item.cat.code === 25) {

        orcaXml.Medical_Class_Number = item.varData?.duration;

        // Medications as outside medication by default. If medication is in stor inhouse and given
        // inhouse, should use code 211,221,231 - need to add an option to choose inhouse or out
        // in the procedure item on frontend
        if (item.varData?.type?.code === 3) item.cat.orcaCode = "222";
        if (item.varData?.type?.code === 5) item.cat.orcaCode = "232";

        let itemXml = {
            $: { type: "record" },
            Medication_Code: { $: { type: "string" }, _: item.srycd },
            Medication_Number: {
                $: { type: "string" },
                _: item.varData.amount,
            },
        };
        orcaXml.Medication_info.Medication_info_child.push(itemXml);
    } else {
      let itemXml = {
          $: { type: "record" },
          Medication_Code: { $: { type: "string" }, _: item.srycd },
          Medication_Name: { $: { type: "string" }, _: "" },
      };
      orcaXml.Medication_info.Medication_info_child.push(itemXml);

    }

    let itemIns = item.ins ? item.ins : insurance;

    if (orcaProcedures[itemIns]) {
      orcaProcedures[itemIns].push(orcaXml);
    } else {
      orcaProcedures[itemIns] = [orcaXml];
    }
  })

  for (let index = 0; index < Object.entries(orcaProcedures).length; index++) {
      const key = Object.entries(orcaProcedures)[index][0];
      const value = Object.entries(orcaProcedures)[index][1];

    let xml = {
        data: {
            medicalreq: {
                $: { type: "record" },
                InOut: { $: {type: "string"}, _: "" },
                Patient_ID: { $: {type: "string"}, _: patientId },
                Medical_Uid: { $: {type: "string"}, _: "" },
                Diagnosis_Information: {
                    $: {type: "record"},
                    Department_Code: { $: {type: "string"}, _: data.department },
                    Physician_Code: {
                        $: {type: "string"},
                        _: data.doctor,
                    },
                    HealthInsurance_Information: {
                        $: { type: "record" },
                        Insurance_Combination_Number: {
                            $: {type: "string"},
                            _: key,
                        },
                    },
                    Medical_Information: {
                        $: { type: "array" },
                        Medical_Information_child: value
                    }
                }
            }
        }
    };

    const responseData = await sendRequest(route, "POST", xml).catch(
        (responseData) => {
            return({err: responseData});
        }
    );
    if ( !validate( responseData, ["00"], "medicalres" ) ) {
        
        return({err: responseData.medicalres.Api_Result_Message});
    }
    return({err: false});

  };
}

////////////////////////////////////////////////////////////////////////////
//////////////////////// Register/Edit Disease//////////////////////////////
////////////////////////////////////////////////////////////////////////////
post.diseases = async function (data, result) {

  data.Disease_AcuteFlag = "";
  data.Disease_SuspectedFlag = ""
  if(data.suspectOrAcuteFlag === "SA") {
    data.Disease_AcuteFlag = "A";
    data.Disease_SuspectedFlag = "S"
  } else if(data.suspectOrAcuteFlag === "A") {
    data.Disease_AcuteFlag = "A";
  } else if (data.suspectOrAcuteFlag === "S") {
    data.Disease_SuspectedFlag = "S"  
  }

  let route = "/orca22/diseasev3";

  let xml = {
    data: {
      diseasereq: {
        $: {type: "record"},
        Patient_ID: { $: {type: "string"}, _: data.patientId },
        Diagnosis_Information: {
          $: {type: "record"},
          Department_Code: { $: {type: "string"}, _: data.department },
        },
        Disease_Information: {
          $: { type: "array" },
          Disease_Information_child: {
            $: { type: "record" },
            Disease_Code: { $: {type: "string"}, _: data.disease.code},
            Disease_Supplement_Name: { $: {type: "string"}, _: data.supplementNote || ""},
            Disease_Category: { $: {type: "string"}, _: data.primaryDisease ? "PD" : ""},
            Disease_SuspectedFlag: { $: {type: "string"}, _: data.Disease_SuspectedFlag || ""},
            Disease_AcuteFlag: { $: {type: "string"}, _: data.Disease_AcuteFlag || ""},
            Disease_Receipt_Print: { $: {type: "string"}, _: data.showOnRezept ? "" : "1"},
            Disease_StartDate: { $: {type: "string"}, _: data.startDate || ""},
            Disease_EndDate: { $: {type: "string"}, _: data.endDate || ""},
            Disease_OutCome: { $: {type: "string"}, _: data.outcome || ""},
            Disease_Class: { $: {type: "string"}, _: "AUTO"},
            Insurance_Combination_Number: { $: {type: "string"}, _: data.insurance},
          }
        }
      }
    }
  }

  const responseData = await sendRequest(route, "POST", xml).catch(
    (responseData) => {
        return({err: responseData});
    }
  );
  if ( !validate( responseData, ['000','W01','W02','W03','W04','W05','W06','W07','W08'], "diseaseres" ) ) {
    result(responseData.diseaseres.Api_Result_Message, null);
    return;
  }
  result(null, responseData);
  return;

}




module.exports.get = get;
module.exports.post = post;
