require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');
const logger = require('./config/logger');
const seedIfEmpty = require('./seed/seedIfEmpty');

process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down...', { error: err.message });
  process.exit(1);
});

const startServer = async () => {
  try {
    await connectDB();

    // ✅ safe seeding
    await seedIfEmpty();

    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
      logger.info(`HRMS API running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });

    process.on('unhandledRejection', (err) => {
      logger.error('UNHANDLED REJECTION!', { error: err.message });
      server.close(() => process.exit(1));
    });

    process.on('SIGTERM', () => {
      logger.info('SIGTERM received. Shutting down...');
      server.close(() => logger.info('Process terminated.'));
    });

  } catch (err) {
    logger.error('Startup error:', err.message);
    process.exit(1);
  }
};

startServer();