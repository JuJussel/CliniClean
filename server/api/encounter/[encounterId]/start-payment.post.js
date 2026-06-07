import Encounter from "../../../models/encounter.model.js";
import Settings from "../../../models/setting.model.js";
import {
  createOrcaReception,
  registerOrcaMedicalProcedures,
  getPatientDiseases,
} from "../../../utils/orcaApiConnector.js";
import { calculateEncounterCost } from "../../../utils/encounterCostCalculator.js";

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

    // Load clinic settings to get opening hours
    const settingsDoc = await Settings.findOne({ category: "settings" });
    const openingHours = settingsDoc?.data?.clinicBaseInfo?.openingHours || [];

    // Fetch patient's active diseases from ORCA
    const diseaseResult = await getPatientDiseases(patient.id, encounter.date);
    if (!diseaseResult.success) {
      throw createError({
        status: 502,
        message: `ORCA Disease Error: ${diseaseResult.message}`,
      });
    }

    // Determine active diseases (no Disease_EndDate)
    const hasActiveDiseases = diseaseResult.diseases.some(d => !d.Disease_EndDate);

    // Calculate base encounter cost (shoshin/saishin + additions)
    const baseCostResult = calculateEncounterCost({
      encounterDate: encounter.date,
      birthDate: patient.birthDate,
      openingHours,
      hasActiveDiseases
    });

    if (!baseCostResult.ok) {
      throw createError({
        status: 500,
        message: "Failed to calculate base encounter cost",
      });
    }

    // Save base cost to the encounter
    encounter.baseCost = baseCostResult.koui;

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

    // Map base cost items to ORCA procedure structure and merge
    const baseProcedures = baseCostResult.koui.map(item => ({
      cat: { code: baseCostResult.type },
      srycd: item.code,
      count: item.times
    }));
    const allProcedures = [...baseProcedures, ...procedures];

    const medicalResult = await registerOrcaMedicalProcedures(
      encounter.department || "01",
      encounter.doctor.id,
      patient.id,
      encounter.date,
      allProcedures,
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
