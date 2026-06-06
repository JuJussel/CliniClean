export default defineEventHandler((event) => {
    const method = event.method;
    const path = event.path;
    const ip = getRequestIP(event);
  
    logger.info({
      type: 'access',
      method,
      path,
      ip,
    }, `[REQUEST] ${method} ${path}`);
  });