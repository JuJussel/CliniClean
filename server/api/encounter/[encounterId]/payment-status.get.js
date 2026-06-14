import Encounter from "../../../models/encounter.model.js";
import {
  getOrcaReceptionList,
  getIncompletePatients,
  getPatientPaymentInfo,
  getPatientMedicalProcedures,
} from "../../../utils/orcaApiConnector.js";

function extractBilledItems(response) {
  const items = [];
  if (!response) return items;

  // 1. Locate the root response node
  const root = response.medicalget02res || response;
  const listInfo = root.Medical_List_Information;
  if (!listInfo) return items;

  // 2. Extract Medical_List_Information_child safely (could be array or single object)
  let listChildList = listInfo.Medical_List_Information_child;
  if (!listChildList) return items;
  if (!Array.isArray(listChildList)) {
    listChildList = [listChildList];
  }

  // 3. Traverse list child nodes to collect Medical_Information_child records
  const medicalInformation = [];
  for (const listChild of listChildList) {
    const medicalInfo = listChild.Medical_Information;
    if (!medicalInfo) continue;

    let medChild = medicalInfo.Medical_Information_child;
    if (!medChild) continue;
    if (!Array.isArray(medChild)) {
      medChild = [medChild];
    }
    medicalInformation.push(...medChild);
  }

  // 4. Extract medications/procedures from each Medical_Information_child
  for (const child of medicalInformation) {
    const medClass = child.Medical_Class;
    const medClassName = child.Medical_Class_Name;

    // Handle case sensitivity (Medication_info vs Medication_Info)
    const medicationInfo = child.Medication_info || child.Medication_Info;
    if (!medicationInfo) continue;

    // Handle case sensitivity of children (Medication_info_child vs Medication_Info_child)
    let medInfoList =
      medicationInfo.Medication_info_child ||
      medicationInfo.Medication_Info_child;
    if (medInfoList === undefined) {
      // Fallback if the container itself holds the items
      medInfoList = medicationInfo;
    }

    if (!Array.isArray(medInfoList)) {
      medInfoList = [medInfoList];
    }

    for (const medItem of medInfoList) {
      if (medItem.Medication_Code) {
        items.push({
          code: medItem.Medication_Code,
          name: medItem.Medication_Name || "",
          number: parseFloat(medItem.Medication_Number || "0"),
          cost: parseFloat(medItem.Medication_Refer_Point || "0"),
          classCode: medClass || "",
          className: medClassName || "",
        });
      }
    }
  }

  return items;
}

export default defineEventHandler(async (event) => {
  const encounterId = event.context.params.encounterId;

  try {
    const encounter = await Encounter.findById(encounterId).populate("patient");
    if (!encounter) {
      throw createError({
        status: 404,
        message: "Encounter not found",
      });
    }

    // 1. Not started encounters do not have an acceptance ID
    if (!encounter.payment?.acceptanceId) {
      return {
        status: "not_registered",
      };
    }

    const patient = encounter.patient;
    if (!patient || !patient.id) {
      throw createError({
        status: 400,
        message: "Patient ORCA ID is missing or invalid.",
      });
    }

    // 2. Check if patient is in intermediate/incomplete list (tmedicalgetv2)

    const recListRes = await getOrcaReceptionList(encounter.date);
    if (!recListRes.success) {
      throw createError({
        status: 502,
        message: `ORCA tmedicalgetv2 Error: ${recListRes.message}`,
      });
    }

    const isOpen = recListRes.receptions.some((r) => {
      const rAcceptId = r.Acceptance_Id;
      if (rAcceptId) {
        return rAcceptId === encounter.payment.acceptanceId;
      }
    });

    if (isOpen) {
      return {
        status: "in_progress",
      };
    }

    // 3. Patient is not in intermediate list, query finalized payment info (incomeinfv2)
    const incomeRes = await getPatientPaymentInfo(patient.id, encounter.date);
    if (!incomeRes.success) {
      throw createError({
        status: 502,
        message: `ORCA incomeinfv2 Error: ${incomeRes.message}`,
      });
    }

    if (incomeRes.payments && incomeRes.payments.length > 0) {
      const paymentRecord = incomeRes.payments.find((p) => {
        return p.Department_Code === (encounter.department || "01");
      });

      if (paymentRecord) {
        const rate = parseInt(paymentRecord.Rate_Cd || "0");
        const points = parseInt(
          paymentRecord.Ac_Point_Information?.Ac_Ttl_Point || "0",
          10,
        );
        const amount = parseInt(
          paymentRecord.Cd_Information.Ac_Money || "0",
          10,
        );

        // Retrieve daily clinical details to extract actual billed items
        let billedProcedures = [];
        try {
          const proceduresRes = await getPatientMedicalProcedures(
            patient.id,
            encounter.date,
            encounter.department || "01",
          );
          if (proceduresRes.success) {
            billedProcedures = extractBilledItems(proceduresRes.raw);
          }
        } catch (err) {
          console.error(
            "[Payment Status API] Failed to fetch detailed ORCA procedures:",
            err,
          );
        }

        return {
          status: "ready_to_pay",
          points,
          amount,
          rate,
          procedures: billedProcedures,
        };
      }
    }

    // If they are in reception list but no procedures exist in intermediate or finalized,
    // or if they are in neither, they are not registered with procedures yet.
    return {
      status: "not_registered",
    };
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    console.error("[Encounter Payment Status API Error]", error);
    throw createError({
      status: 500,
      statusMessage: "Internal Server Error",
      message: error.message || "Failed to fetch payment status from ORCA",
    });
  }
});
