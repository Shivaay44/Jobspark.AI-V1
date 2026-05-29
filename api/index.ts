import { app } from '../server/app';
import { errorHandler } from '../server/middleware/errorHandler';

// On Vercel, register the error handler directly to capture API route errors
app.use(errorHandler);

// Export the Express app instance for Vercel Serverless hosting
export default app;
