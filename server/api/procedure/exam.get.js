import examination from "../../models/examination.model.js";

export default defineEventHandler(async (event) => {
  try {
    const { srycd } = getQuery(event);
    if (!srycd) {
      throw createError({
        status: 400,
        statusMessage: 'Bad Request',
        message: 'srycd is required'
      });
    }

    // MongoDB handles limit and sort internally or we can add it to the query if needed.
    // But we'll just find the documents for now.

    const exams = await examination.find({ "procedure.code": { $regex: srycd + ".*" } }).lean();

    return {
      success: true,
      data: exams
    };

  } catch (error) {
    if (error.statusCode) {
      throw error;
    }

    console.error('[Exam API Error]', {
      error: error.message,
      stack: error.stack
    });

    throw createError({
      status: 500,
      statusMessage: 'Internal Server Error',
      message: 'Failed to fetch exam data'
    });
  }
})
