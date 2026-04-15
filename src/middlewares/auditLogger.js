const AuditLog = require('../models/AuditLog');
const logger = require('../config/logger');

const actionMap = {
  GET: 'VIEW',
  POST: 'CREATE',
  PUT: 'UPDATE',
  PATCH: 'UPDATE',
  DELETE: 'DELETE',
};

const auditLogger = (resource) => {
  return async (req, res, next) => {
    const originalSend = res.json.bind(res);

    res.json = async (body) => {
      try {
        const action = actionMap[req.method] || 'VIEW';
        const status = res.statusCode < 400 ? 'success' : 'failure';

        await AuditLog.create({
          user: req.user?._id,
          action,
          resource,
          resourceId: req.params?.id,
          description: `${action} on ${resource}`,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
          status,
        });
      } catch (err) {
        logger.error('Audit log error:', err.message);
      }
      return originalSend(body);
    };

    next();
  };
};

module.exports = auditLogger;
