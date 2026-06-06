import Encounter from "../../../models/encounter.model.js";
import {
  createOrcaReception,
  registerOrcaMedicalProcedures,
} from "../../../utils/orcaApiConnector.js";

export default defineEventHandler(async (event) => {
  const encounterId = event.context.params.encounterId;

  try {
    // Fetch the encounter and populate the patient
    const encounter = await Encounter.findById(encounterId)
      .populate("patient")
      .populate("doctor");
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
        message:
          "Patient ORCA ID is missing or invalid. Please ensure the patient is registered in ORCA.",
      });
    }

    // 1. Create a reception in ORCA (acceptmodv2)
    const receptionResult = await createOrcaReception(
      patient.id,
      encounter.department || "01",
      encounter.doctor.id,
      encounter.ins,
    );
    if (!receptionResult.success) {
      throw createError({
        status: 502,
        message: `ORCA Reception Error: ${receptionResult.message}`,
      });
    }

    // 2. Add procedures/billing info to ORCA (medicalmodv2?class=01)
    const procedures = encounter.karte?.procedures || [];
    // Only call medicalmodv2 if there are procedures to register (or call it with empty if needed, but usually we register them)
    const medicalResult = await registerOrcaMedicalProcedures(
      encounter.department || "01",
      encounter.doctor.id,
      patient.id,
      encounter.date,
      procedures,
      encounter.ins,
    );

    if (!medicalResult.success) {
      throw createError({
        status: 502,
        message: `ORCA Medical Procedures Error: ${medicalResult.message}`,
      });
    }

    // 3. Update the encounter status to 4 (payment)
    encounter.status = 4;
    await encounter.save();

    return {
      success: true,
      data: encounter,
    };
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    console.error("[Start Payment API Error]", error);
    throw createError({
      status: 500,
      statusMessage: "Internal Server Error",
      message: error.message || "Failed to start payment process",
    });
  }
});
