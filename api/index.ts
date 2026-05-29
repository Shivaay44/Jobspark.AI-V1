import { app, configureApp } from '../server/app';

// Ensure the App is configured with routing middleware and error handlers
await configureApp(app);

// Export the Express app instance for Vercel Serverless hosting
export default app;
