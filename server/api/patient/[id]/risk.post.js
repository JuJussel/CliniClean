import Patient from "../../../models/patient.model.js";
import Encounter from "../../../models/encounter.model.js";
import SocialRisk from "../../../models/socialRisk.model.js";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id").toString().padStart(5, "0");
    const body = await readBody(event);

    const { encounterId, values, recordedBy } = body;

    // Validation
    if (!id || typeof id !== "string") {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid Patient ID",
        message: "Patient ID is required",
      });
    }

    if (!encounterId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request",
        message: "encounterId is required",
      });
    }

    if (!values || typeof values !== "object") {
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request",
        message: "values must be an object of key-value pairs",
      });
    }

    // Find patient in DB first to get MongoDB ObjectId
    const patientDoc = await Patient.findOne({ id });
    if (!patientDoc) {
      throw createError({
        statusCode: 404,
        statusMessage: "Patient Not Found",
        message: `Patient with ID ${id} not found in database.`,
      });
    }

    // Fetch encounter to check status
    const encounter = await Encounter.findById(encounterId);
    if (!encounter) {
      throw createError({
        statusCode: 404,
        statusMessage: "Not Found",
        message: "Encounter not found",
      });
    }

    // Risks can only be saved when encounter status is 3 (activeReception)
    if (encounter.status !== 3) {
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request",
        message: "Social risks can only be recorded if the encounter status is active (status 3)",
      });
    }

    // Auto-calculate Brickman Index (MD0012920) if possible
    // MD0012900: 1日の喫煙本数, MD0012910: 通算喫煙年数
    const smokingCount = parseFloat(values["MD0012900"]);
    const smokingYears = parseFloat(values["MD0012910"]);
    if (!isNaN(smokingCount) && !isNaN(smokingYears)) {
      values["MD0012920"] = (smokingCount * smokingYears).toString();
    } else {
      // If either is cleared or invalid, clear or don't set the index
      if (values["MD0012900"] === "" || values["MD0012910"] === "") {
        values["MD0012920"] = "";
      }
    }

    const session = await getUserSession(event);
    const userId = recordedBy || session?.user?.id || session?.user?._id || event.context.auth?.user?.id || event.context.auth?.user?._id || null;

    // Create and save social risk entry
    const riskEntry = new SocialRisk({
      patient: patientDoc._id,
      encounter: encounter._id,
      recordedBy: userId,
      values,
      date: new Date(),
    });

    await riskEntry.save();

    return {
      success: true,
      data: riskEntry,
    };
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }

    console.error("[Patient Social Risk POST API Error]", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      message: error.message || "Failed to record patient social risks",
    });
  }
});
