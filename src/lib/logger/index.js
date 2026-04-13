/**
 * Centralized Logger for CuentasClarasRD
 * Provides consistent logging across client and server.
 */

const LOG_LEVELS = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  DEBUG: 'DEBUG'
};

const formatMessage = (level, message, context = {}) => {
  const timestamp = new Date().toISOString();
  const contextStr = Object.keys(context).length ? ` | Context: ${JSON.stringify(context)}` : '';
  return `[${timestamp}] [${level}] ${message}${contextStr}`;
};

export const logger = {
  info: (message, context) => {
    console.log(formatMessage(LOG_LEVELS.INFO, message, context));
  },
  
  warn: (message, context) => {
    console.warn(formatMessage(LOG_LEVELS.WARN, message, context));
  },
  
  error: (message, error, context = {}) => {
    const errorDetails = error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack
    } : { raw: error };
    
    console.error(formatMessage(LOG_LEVELS.ERROR, message, { ...context, ...errorDetails }));
    
    // In production, this would also push to an external provider (e.g. Sentry)
  },
  
  debug: (message, context) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(formatMessage(LOG_LEVELS.DEBUG, message, context));
    }
  }
};
