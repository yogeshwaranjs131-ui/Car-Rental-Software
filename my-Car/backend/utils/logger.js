/**
 * Simple Logger Utility
 * You can enhance this with winston or morgan if needed
 */

const logger = {
  info: (message) => {
    const timestamp = new Date().toISOString();
    console.log(`[INFO] [${timestamp}]: ${message}`);
  },
  
  error: (message, error = '') => {
    const timestamp = new Date().toISOString();
    console.error(`[ERROR] [${timestamp}]: ${message}`, error);
  },

  warn: (message) => {
    const timestamp = new Date().toISOString();
    console.warn(`[WARN] [${timestamp}]: ${message}`);
  },

  debug: (message) => {
    if (process.env.NODE_ENV !== 'production') {
      const timestamp = new Date().toISOString();
      console.debug(`[DEBUG] [${timestamp}]: ${message}`);
    }
  }
};

module.exports = logger;