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
    const m = String(date.getMonth() + 1).padStart(2, '0');
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
        console.log(deleteResponse);
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
