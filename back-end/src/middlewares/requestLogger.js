export const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`📝 [${timestamp}] ${req.method} ${req.path}`);

  if (req.method === 'POST' && req.body) {
    const safeBody = { ...req.body };
    if (safeBody.password) safeBody.password = '[HIDDEN]';
    console.log(`📦 Request body:`, safeBody);
  }

  next();
};