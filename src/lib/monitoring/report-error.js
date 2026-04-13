import { logger } from '../logger';

/**
 * Standardized Error Reporting Hook
 * Use this to wrap critical catch blocks.
 * 
 * @param {Error} error - The error object
 * @param {string} source - Where the error originated (e.g., 'API:Vision_Parse')
 * @param {object} metadata - Optional extra context
 */
export async function reportError(error, source, metadata = {}) {
  // 1. Log to console/internal logger
  logger.error(`Error in ${source}: ${error.message}`, error, metadata);

  // 2. Mock external service push (e.g. Sentry.captureException)
  // if (process.env.NODE_ENV === 'production') {
  //   pushToMonitoringService(error, { source, ...metadata });
  // }

  return {
    reported: true,
    timestamp: new Date().toISOString(),
    source
  };
}
