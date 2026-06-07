import Encounter from "../../../models/encounter.model.js";
import {
  getOrcaReceptionList,
  getIncompletePatients,
  getPatientPaymentInfo,
} from "../../../utils/orcaApiConnector.js";

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

    const patient = encounter.patient;
    if (!patient || !patient.id) {
      throw createError({
        status: 400,
        message: "Patient ORCA ID is missing or invalid.",
      });
    }

    // 1. Check if patient is registered in ORCA reception for today
    const receptionRes = await getOrcaReceptionList(
      encounter.date,
      encounter.department || "01",
    );
    if (!receptionRes.success) {
      throw createError({
        status: 502,
        message: `ORCA acceptlstv2 Error: ${receptionRes.message}`,
      });
    }

    const isRegisteredInReception = receptionRes.receptions.some(
      (r) => r.Patient_Information?.Patient_ID === patient.id,
    );

    if (!isRegisteredInReception) {
      return {
        status: "not_registered",
      };
    }

    // 2. Check if patient is in intermediate/incomplete list (tmedicalgetv2)
    const tmedRes = await getIncompletePatients(encounter.date);
    if (!tmedRes.success) {
      throw createError({
        status: 502,
        message: `ORCA tmedicalgetv2 Error: ${tmedRes.message}`,
      });
    }

    const isIntermediate = tmedRes.patients.some(
      (p) => p.Patient_Information?.Patient_ID === patient.id,
    );

    if (isIntermediate) {
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
      const paymentRecord = incomeRes.payments[0];
      const points = parseInt(
        paymentRecord.Ac_Point_Information?.Ac_Ttl_Point || "0",
        10,
      );
      const amount = parseInt(paymentRecord.Ac_Money || "0", 10);

      return {
        status: "ready_to_pay",
        points,
        amount,
      };
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
