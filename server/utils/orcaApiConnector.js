import xml2js from "xml2js";
import { toFullwidth, toKatakana } from "japanese-string-utils";

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
export async function callOrcaApi(endpoint, method = "GET", data = null) {
  const url = `${orcaUrl}${endpoint}`;

  const options = {
    method,
    headers: {
      "Content-Type": "text/xml",
      Authorization:
        "Basic " + Buffer.from(`${orcaUser}:${orcaPass}`).toString("base64"),
    },
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
      throw new Error(
        `Orca API error: ${response.statusText} (${response.status})`,
      );
    }
    var responseData = await response.text();
    responseData = await xml2js.parseStringPromise(responseData, xmlOptions);
    return responseData.xmlio2;
  } catch (error) {
    console.error("Error calling Orca API:", error);
    throw error;
  }
}

/**
 * Build full-width WholeName from family and given names
 * @param {object} name - Name object with family and given properties
 * @returns {string} Combined name in full-width
 */
function buildWholeName(name) {
  if (!name) return "";
  const family = name.family || "";
  const given = name.given || "";
  const combined = `${family}\u3000${given}`.trim();
  return toFullwidth(combined);
}

/**
 * Build full-width kana name from family and given kana names
 * @param {object} name - Name object with familyKana and givenKana properties
 * @returns {string} Combined kana name in full-width
 */
function buildWholeNameKana(name) {
  if (!name) return "";
  const familyKana = name.familyKana || "";
  const givenKana = name.givenKana || "";
  const combined = `${familyKana}\u3000${givenKana}`.trim();
  return toFullwidth(toKatakana(combined));
}

/**
 * Format birthDate to Orca format (YYYY-MM-DD)
 * @param {Date|string} birthDate - Birth date as Date object or string
 * @returns {string} Formatted date string YYYY-MM-DD
 */
function formatBirthDate(birthDate) {
  if (!birthDate) return "";
  const date = new Date(birthDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Validate if apir result includes valid return codes 00, K1-K5
 * @param {object} apiResult - The Api_Result object from Orca response
 * @returns {boolean} True if valid, false otherwise
 */
function isValidApiResult(apiResult, codes, path = null) {
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

    const response = await callOrcaApi(endpoint, "GET");

    // Validate response structure
    if (!isValidApiResult(response, ["00"], "patientinfores")) {
      const errorMsg =
        response.patientinfores.Api_Result_Message ||
        "Unknown error during patient registration";
      return { success: false, message: errorMsg };
    }
    return {
      success: true,
      patientInfo: response.patientinfores.Patient_Information,
    };
  } catch (error) {
    return { success: false, message: error };
  }
}

/**
 * Fetch patient disease/diagnosis information from ORCA
 * @param {string} patientId - The patient's Orca ID
 * @param {Date|string} performDate - Reference date to determine active diseases (formatted to YYYY-MM)
 * @returns {Promise<object>} Object with success flag and array of diseases
 */
export async function getPatientDiseases(patientId, performDate) {
  try {
    const date = new Date(performDate);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const baseDate = `${y}-${m}`;

    const orcaDiseaseData = {
      data: {
        disease_inforeq: {
          $: { type: "record" },
          Patient_ID: { $: { type: "string" }, _: patientId },
          Base_Date: { $: { type: "string" }, _: baseDate },
          Select_Mode: { $: { type: "string" }, _: "All" },
        },
      },
    };

    const endpoint = "/api01rv2/diseasegetv2?class=01";
    const response = await callOrcaApi(endpoint, "POST", orcaDiseaseData);

    if (!isValidApiResult(response, ["00", "B1", "21"], "disease_infores")) {
      const errorMsg =
        response.disease_infores?.Api_Result_Message ||
        "Unknown error during patient disease query";
      return { success: false, message: errorMsg };
    }

    const diseaseInfo = response.disease_infores?.Disease_Information;
    let diseaseList = diseaseInfo?.Disease_Information_child || [];
    if (diseaseList && !Array.isArray(diseaseList)) {
      diseaseList = [diseaseList];
    }

    return {
      success: true,
      diseases: diseaseList,
    };
  } catch (error) {
    console.error("Error fetching patient diseases:", error);
    return { success: false, message: error.message || error };
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
          $: { type: "record" },
          Patient_ID: { $: { type: "string" }, _: "*" }, // Auto-generate patient ID
          WholeName: {
            $: { type: "string" },
            _: buildWholeName(patientData.name),
          },
          WholeName_inKana: {
            $: { type: "string" },
            _: buildWholeNameKana(patientData.name),
          },
          BirthDate: {
            $: { type: "string" },
            _: formatBirthDate(patientData.birthDate),
          },
          Sex: {
            $: { type: "string" },
            _: patientData.gender === "male" ? "1" : "2",
          },
          CellularNumber: {
            $: { type: "string" },
            _: patientData.telecom?.phoneMobile || "",
          },
          EmailAddress: {
            $: { type: "string" },
            _: patientData.telecom?.email || "",
          },
          Home_Address_Information: {
            $: { type: "record" },
            Address_ZipCode: {
              $: { type: "string" },
              _: patientData.address?.zip || "",
            },
            WholeAddress1: {
              $: { type: "string" },
              _: patientData.address?.address || "",
            },
            WholeAddress2: {
              $: { type: "string" },
              _: patientData.address?.line || "",
            },
            PhoneNumber1: {
              $: { type: "string" },
              _: patientData.telecom?.phoneHome || "",
            },
          },
          HealthInsurance_Information: {
            $: { type: "record" },
            InsuranceProvider_Class: { $: { type: "string" }, _: "980" },
          },
        },
      },
    };

    const endpoint = "/orca12/patientmodv2?class=01";
    const response = await callOrcaApi(endpoint, "POST", orcaPatientData);
    // Delete patient if registration failed due to duplicate (K0) to prevent orphan records in Orca
    if (
      !isValidApiResult(
        response,
        ["00", "K1", "K2", "K3", "K4", "K5"],
        "patientmodres",
      )
    ) {
      if (response.patientmodres.Api_Result === "K0") {
        const deletePatient = {
          data: {
            patientmodreq: {
              $: { type: "record" },
              Patient_ID: {
                $: { type: "string" },
                _: response.patientmodres.Patient_Information.Patient_ID,
              },
              WholeName: {
                $: { type: "string" },
                _: buildWholeName(patientData.name),
              },
              WholeName_inKana: {
                $: { type: "string" },
                _: buildWholeNameKana(patientData.name),
              },

              BirthDate: {
                $: { type: "string" },
                _: formatBirthDate(patientData.birthDate),
              },
              Sex: {
                $: { type: "string" },
                _: patientData.gender === "male" ? "1" : "2",
              },
            },
          },
        };
        const endpoint = "/orca12/patientmodv2?class=03";

        const deleteResponse = await callOrcaApi(
          endpoint,
          "POST",
          deletePatient,
        );
      }
      const errorMsg =
        response.patientmodres.Api_Warning_Message1 ||
        "Unknown error during patient registration";
      return { success: false, message: errorMsg };
    }

    return {
      success: true,
      patientInfo: response.patientmodres.Patient_Information,
    };
  } catch (error) {
    console.error("Error registering patient:", error);
    return { success: false, message: error };
  }
}

/**
 * Create a reception in Orca
 * @param {string} patientId - The patient's Orca ID
 * @param {string} departmentCode - Department code, defaults to "01"
 * @returns {Promise<object>} Response from Orca API
 */
export async function createOrcaReception(
  patientId,
  departmentCode = "01",
  doctor,
  ins,
) {
  try {
    const orcaReceptionData = {
      data: {
        acceptreq: {
          $: { type: "record" },
          Request_Number: { $: { type: "string" }, _: "01" },
          Patient_ID: { $: { type: "string" }, _: patientId },
          Department_Code: { $: { type: "string" }, _: departmentCode },
          Physician_Code: { $: { type: "string" }, _: doctor },
          HealthInsurance_Information: {
            $: { type: "record" },
            Insurance_Combination_Number: { $: { type: "string" }, _: ins },
          },
        },
      },
    };

    const endpoint = "/orca11/acceptmodv2?class=01";
    const response = await callOrcaApi(endpoint, "POST", orcaReceptionData);

    if (!isValidApiResult(response, ["00", "K1", "K2", "K3"], "acceptres")) {
      const errorMsg =
        response.acceptres.Api_Result_Message ||
        "Unknown error during Orca reception creation";
      return { success: false, message: errorMsg };
    }

    return { success: true, response: response.acceptres };
  } catch (error) {
    console.error("Error creating Orca reception:", error);
    return { success: false, message: error.message || error };
  }
}

/**
 * Register medical procedures/billing info in Orca
 * @param {string} patientId - The patient's Orca ID
 * @param {Date|string} performDate - The encounter date
 * @param {Array} procedures - List of procedures to register
 * @returns {Promise<object>} Response from Orca API
 */
export async function registerOrcaMedicalProcedures(
  departmentCode = "01",
  doctor,
  patientId,
  performDate,
  procedures,
  ins,
) {
  try {
    const formattedDate = formatBirthDate(performDate);

    const medicalInfoChildList = [];

    for (const proc of procedures) {
      let medicalClass = proc.cat?.code || "01";
      let medicalClassNumber = proc.count ? String(proc.count) : "1";
      const medicationInfoChild = [];

      if (medicalClass === "310") {
        let procCode = "130000510";
        if (proc.varData?.location === "静脈") {
          medicalClass = "320";
          procCode = "130003510";
        }

        medicationInfoChild.push({
          $: { type: "record" },
          Medication_Code: { $: { type: "string" }, _: procCode },
          Medication_Name: { $: { type: "string" }, _: "" },
        });

        medicationInfoChild.push({
          $: { type: "record" },
          Medication_Code: { $: { type: "string" }, _: proc.srycd },
          Medication_Number: {
            $: { type: "string" },
            _: proc.varData?.amount ? String(proc.varData.amount) : "1",
          },
        });
      } else if (proc.cat?.code === "212") {
        medicalClassNumber = proc.varData?.duration
          ? String(proc.varData.duration)
          : "1";

        if (proc.varData?.type?.code === 3) {
          medicalClass = "222";
        } else if (proc.varData?.type?.code === 5) {
          medicalClass = "232";
        } else {
          medicalClass = "212";
        }

        medicationInfoChild.push({
          $: { type: "record" },
          Medication_Code: { $: { type: "string" }, _: proc.srycd },
          Medication_Number: {
            $: { type: "string" },
            _: proc.varData?.amount ? String(proc.varData.amount) : "1",
          },
        });
      } else {
        medicationInfoChild.push({
          $: { type: "record" },
          Medication_Code: { $: { type: "string" }, _: proc.srycd },
        });
      }

      medicalInfoChildList.push({
        $: { type: "record" },
        Medical_Class: { $: { type: "string" }, _: medicalClass },
        Medical_Class_Number: { $: { type: "string" }, _: medicalClassNumber },
        Medication_info: {
          $: { type: "array" },
          Medication_info_child: medicationInfoChild,
        },
      });
    }

    const orcaMedicalData = {
      data: {
        medicalreq: {
          $: { type: "record" },
          InOut: { $: { type: "string" }, _: "2" }, // 2: Outpatient
          Patient_ID: { $: { type: "string" }, _: patientId },
          Perform_Date: { $: { type: "string" }, _: formattedDate },
          Diagnosis_Information: {
            $: { type: "record" },
            Department_Code: { $: { type: "string" }, _: departmentCode },
            Physician_Code: { $: { type: "string" }, _: doctor },
            HealthInsurance_Information: {
              $: { type: "record" },
              Insurance_Combination_Number: { $: { type: "string" }, _: ins },
            },
            Medical_Information: {
              $: { type: "array" },
              Medical_Information_child: medicalInfoChildList,
            },
          },
        },
      },
    };

    const endpoint = "/api21/medicalmodv2?class=01";
    const response = await callOrcaApi(endpoint, "POST", orcaMedicalData);
    logger.info({ response }, "orca response");

    if (
      !isValidApiResult(
        response,
        ["00", "000", "K1", "K2", "K3", "K4", "K5"],
        "medicalres",
      )
    ) {
      const errorMsg =
        response.medicalres.Api_Result_Message ||
        "Unknown error during medical procedures registration";
      return { success: false, message: errorMsg };
    }

    return { success: true, response: response.medicalres };
  } catch (error) {
    console.error("Error registering Orca medical procedures:", error);
    return { success: false, message: error.message || error };
  }
}

/**
 * Fetch patient payment/income info from ORCA
 * @param {string} patientId - The patient's Orca ID
 * @param {Date|string} performDate - The examination date
 * @returns {Promise<object>} Payment/income information
 */
export async function getPatientPaymentInfo(patientId, performDate) {
  try {
    const formattedDate = formatBirthDate(performDate); // YYYY-MM-DD
    const orcaRequestData = {
      data: {
        private_objects: {
          $: { type: "record" },
          Patient_ID: { $: { type: "string" }, _: patientId },
          Perform_Date: { $: { type: "string" }, _: formattedDate },
        },
      },
    };
    const endpoint = "/api01rv2/incomeinfv2";
    const response = await callOrcaApi(endpoint, "POST", orcaRequestData);

    if (!isValidApiResult(response, ["0000", "B1", "21"], "private_objects")) {
      const errorMsg =
        response.private_objects?.Api_Result_Message ||
        "Error fetching payment info";
      return { success: false, message: errorMsg };
    }

    const incomeInfo = response.private_objects?.Income_Information;
    let incomeList = incomeInfo?.Income_Information_child || [];
    if (incomeList && !Array.isArray(incomeList)) {
      incomeList = [incomeList];
    }

    return {
      success: true,
      payments: incomeList,
      raw: response.private_objects,
    };
  } catch (error) {
    console.error("Error fetching patient payment info:", error);
    return { success: false, message: error.message || error };
  }
}

/**
 * Fetch all registered receptions in ORCA for a specific date
 * @param {Date|string} performDate - The examination date
 * @param {string} departmentCode - The department code (default '01')
 * @returns {Promise<object>} List of registered receptions
 */
export async function getOrcaReceptionList(performDate, departmentCode = "01") {
  try {
    const formattedDate = formatBirthDate(performDate); // YYYY-MM-DD
    const orcaRequestData = {
      data: {
        acceptlstreq: {
          $: { type: "record" },
          Acceptance_Date: { $: { type: "string" }, _: formattedDate },
          Department_Code: { $: { type: "string" }, _: departmentCode },
          Physician_Code: { $: { type: "string" }, _: "" },
          Medical_Information: { $: { type: "string" }, _: "" },
          Display_Order_Sort: { $: { type: "string" }, _: "True" },
        },
      },
    };
    const endpointOpen = "/api01rv2/acceptlstv2?class=01"; // class=01 for open receptions
    const responseOpen = await callOrcaApi(
      endpointOpen,
      "POST",
      orcaRequestData,
    );

    if (!isValidApiResult(responseOpen, ["00", "B1", "21"], "acceptlstres")) {
      const errorMsg =
        responseOpen.acceptlstres?.Api_Result_Message ||
        "Error fetching ORCA reception list";
      return { success: false, message: errorMsg };
    }

    const acceptInfoListOpen =
      responseOpen.acceptlstres?.Acceptlst_Information
        ?.Acceptlst_Information_child || [];
    const receptionsOpen = Array.isArray(acceptInfoListOpen)
      ? acceptInfoListOpen
      : [acceptInfoListOpen];

    return {
      success: true,
      receptions: responseOpen.acceptlstres?.Acceptlst_Information
        ? receptionsOpen
        : [],
    };
  } catch (error) {
    console.error("Error fetching ORCA reception list:", error);
    return { success: false, message: error.message || error };
  }
}

/**
 * Fetch detailed medical procedures/practice contents for a specific date and department (medicalgetv2?class=02)
 * @param {string} patientId - The patient's Orca ID
 * @param {Date|string} performDate - The examination date
 * @param {string} departmentCode - The department code (default '01')
 * @returns {Promise<object>} List of medical practices
 */
export async function getPatientMedicalProcedures(
  patientId,
  performDate,
  departmentCode = "01",
) {
  try {
    const formattedDate = formatBirthDate(performDate); // YYYY-MM-DD
    const orcaRequestData = {
      data: {
        medicalgetreq: {
          $: { type: "record" },
          InOut: { $: { type: "string" }, _: "O" }, // O: Outpatient
          Patient_ID: { $: { type: "string" }, _: patientId },
          Perform_Date: { $: { type: "string" }, _: formattedDate },
          Medical_Information: {
            $: { type: "record" },
            Department_Code: { $: { type: "string" }, _: departmentCode },
          },
        },
      },
    };
    const endpoint = "/api01rv2/medicalgetv2?class=02";
    const response = await callOrcaApi(endpoint, "POST", orcaRequestData);

    if (
      !isValidApiResult(response, ["00", "0000", "B1", "21"], "medicalget02res")
    ) {
      const errorMsg =
        response.medicalgetres?.Api_Result_Message ||
        "Error fetching medical practice details";
      return { success: false, message: errorMsg };
    }

    return {
      success: true,
      raw: response,
    };
  } catch (error) {
    console.error("Error fetching patient medical practices:", error);
    return { success: false, message: error.message || error };
  }
}

/**
 * Register patient diseases in ORCA (diseasev3?class=01)
 * @param {string} patientId - The patient's Orca ID
 * @param {Date|string} performDate - The encounter date
 * @param {string} departmentCode - Department code (default '01')
 * @param {Array} diseases - List of diseases to register
 * @returns {Promise<object>} Response from Orca API
 */
export async function registerPatientDisease(
  patientId,
  performDate,
  departmentCode = "01",
  diseases,
) {
  try {
    const formattedPerformDate = formatBirthDate(performDate);

    const diseaseChildren = diseases.map((disease) => {
      // Map UI outcome codes to ORCA outcome codes (e.g. C -> P)
      let outcome = disease.outcome;

      const child = {
        $: { type: "record" },
        Disease_Code: { $: { type: "string" }, _: disease.code },
        Disease_StartDate: {
          $: { type: "string" },
          _: formatBirthDate(disease.startDate),
        },
        Disease_InOut: { $: { type: "string" }, _: disease.inOut || "O" },
      };

      if (disease.name) {
        child.Disease_Name = { $: { type: "string" }, _: disease.name };
      }
      if (disease.category) {
        child.Disease_Category = { $: { type: "string" }, _: disease.category };
      }
      if (disease.suspectFlag) {
        child.Disease_SuspectedFlag = {
          $: { type: "string" },
          _: disease.suspectFlag,
        };
      }
      if (disease.acuteFlag) {
        child.Disease_AcuteFlag = {
          $: { type: "string" },
          _: disease.acuteFlag,
        };
      }
      if (disease.endDate) {
        child.Disease_EndDate = {
          $: { type: "string" },
          _: formatBirthDate(disease.endDate),
        };
      }
      if (outcome) {
        child.Disease_OutCome = { $: { type: "string" }, _: outcome };
      }
      if (disease.description) {
        child.Disease_Supplement_Name = {
          $: { type: "string" },
          _: disease.description,
        };
      }
      if (disease.insuranceComboNumber) {
        child.Insurance_Combination_Number = {
          $: { type: "string" },
          _: disease.insuranceComboNumber,
        };
      }

      return child;
    });

    const orcaRequest = {
      data: {
        diseasereq: {
          $: { type: "record" },
          Patient_ID: { $: { type: "string" }, _: patientId },
          Base_Month: {
            $: { type: "string" },
            _: formattedPerformDate.substring(0, 7),
          },
          Perform_Date: { $: { type: "string" }, _: formattedPerformDate },
          Perform_Time: { $: { type: "string" }, _: "00:00:00" },
          Diagnosis_Information: {
            $: { type: "record" },
            Department_Code: {
              $: { type: "string" },
              _: departmentCode || "01",
            },
          },
          Disease_Information: {
            $: { type: "array" },
            Disease_Information_child: diseaseChildren,
          },
        },
      },
    };

    const endpoint = "/orca22/diseasev3?class=01";
    const response = await callOrcaApi(endpoint, "POST", orcaRequest);

    if (!isValidApiResult(response, ["000", "00"], "diseaseres")) {
      const errorMsg =
        response.diseaseres?.Api_Result_Message ||
        "Unknown error registering patient disease";
      return { success: false, message: errorMsg };
    }

    return {
      success: true,
      data: response.diseaseres,
    };
  } catch (error) {
    console.error("Error registering patient disease in ORCA:", error);
    return { success: false, message: error.message || error };
  }
}
