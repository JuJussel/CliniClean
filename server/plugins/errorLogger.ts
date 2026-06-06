import { H3Error } from 'h3';

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('error', (error: any, { event }) => {
    // 1. Catch deliberate API errors (throw createError or errors with a statusCode)
    const isH3Error = error instanceof H3Error || (error && typeof error === 'object' && 'statusCode' in error);

    if (isH3Error) {
      // Log 4xx client errors as warnings, and 5xx server errors as critical
      const statusCode = error.statusCode || 500;
      const level = statusCode >= 500 ? 'error' : 'warn';
      
      logger[level]({
        type: 'api_error',
        statusCode,
        statusMessage: error.statusMessage,
        message: error.message,
        stack: statusCode >= 500 ? error.stack : undefined,
        path: event?.path,
        method: event?.method,
      }, `[API ${statusCode}] ${error.statusMessage || error.message}`);
      
      return; // Exit early so we don't log it again below
    }

    // 2. Catch unexpected server crashes (throw new Error, TypeErrors, etc.)
    logger.error({
      type: 'exception',
      message: error.message,
      stack: error.stack,
      path: event?.path,
      method: event?.method,
    }, `[CRASH] ${error.message}`);
  });
});